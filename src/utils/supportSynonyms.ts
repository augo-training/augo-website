// Concept expansion for support search. Data only — no logic beyond building
// the lookup map at module init.
//
// Three separate relations, because they behave differently:
//
//   SYNONYM_GROUPS  symmetric     any member expands to all others
//   HYPERNYMS       directional   garmin => device, but device !=> garmin
//   PHRASE_ALIASES  phrase => tokens
//
// Entries are written as STEMS (the output of lightStem), because expansion
// happens after normalisation. "syncing" would never be looked up; "sync" is.

import { lightStem } from './textNormalize'

/**
 * Symmetric concept groups. Any member expands to every other member.
 *
 * Groups rather than a directed Record<string, string[]> deliberately: with a
 * directed map you forget the reverse edge every single time, and the failure is
 * silent and asymmetric ("connect" finds sync, "sync" doesn't find connect).
 *
 * Billing is split into five narrow groups rather than one broad one. Today a
 * single article owns all of it so a fat group would be harmless — but the
 * moment billing splits into two articles, one fat group makes them
 * indistinguishable. Narrow groups are the version that survives growth.
 */
export const SYNONYM_GROUPS: readonly (readonly string[])[] = [
  // Connecting data sources
  ['sync', 'connect', 'pair', 'link', 'integrate', 'integration', 'import', 'upload'],
  // Things not arriving
  ['missing', 'disappear', 'gone', 'absent', 'empty', 'blank'],
  // Leaving
  ['cancel', 'unsubscribe', 'quit', 'terminate', 'leave'],
  // Money — four narrow groups, not one
  ['billing', 'invoice', 'payment', 'charge', 'card', 'receipt'],
  ['price', 'pricing', 'cost', 'fee', 'pay', 'paying', 'paid'],
  ['free', 'trial', 'freemium'],
  ['plan', 'subscription', 'tier', 'membership', 'upgrade', 'downgrade'],
  // The daily list
  ['priority', 'attention', 'alert', 'flag', 'insight', 'digest', 'daily'],
  ['signal', 'indicator', 'marker', 'trend'],
  // Training setup
  ['zone', 'threshold', 'ftp', 'lthr', 'intensity'],
  ['anchor', 'baseline', 'benchmark', 'fitness'],
  ['template', 'library', 'reusable', 'saved', 'prescribe', 'assign', 'reuse'],
  // Feedback
  ['feedback', 'rpe', 'survey', 'questionnaire', 'checkin', 'subjective'],
  // Roster
  ['athlete', 'client', 'roster'],
  ['invite', 'invitation', 'onboard', 'join', 'signup'],
  // Competitors and migration
  ['trainingpeak', 'tp', 'todaysplan', 'finalsurge', 'intervalsicu'],
  ['migrate', 'switch', 'replace', 'alongside', 'instead'],
  ['selfcoached', 'solo'],
  // Sessions
  ['workout', 'session', 'activity', 'training'],
  ['device', 'wearable', 'tracker', 'watch'],
  // History brought in from before the connection
  ['backfill', 'history', 'historical', 'past', 'previous', 'older', 'old', 'archive'],
  // Planned workouts reaching the device
  ['deliver', 'delivered', 'push', 'send', 'sent', 'planned', 'structured', 'calendar'],
  // Private notes as assistant memory
  ['note', 'notes', 'memory', 'context', 'briefing'],
  // The Claude / ChatGPT connector
  ['connector', 'mcp', 'claude', 'chatgpt', 'llm'],
  // The coach directory
  ['directory', 'listing', 'listed', 'inbound'],
  // Making workouts
  ['create', 'build', 'builder', 'design', 'write'],
]

/**
 * Directional broadening. `garmin` implies `device`, but `device` must not
 * imply `garmin`.
 *
 * This is a genuinely distinct relation and worth keeping separate: Garmin and
 * Coros must NOT be synonyms of each other, or a query for "coros" floats a
 * Garmin-specific article. Broadening each to `device` is correct; equating them
 * is not.
 */
export const HYPERNYMS: Readonly<Record<string, readonly string[]>> = {
  garmin: ['device', 'watch'],
  coros: ['device', 'watch'],
  polar: ['device', 'watch'],
  wahoo: ['device'],
  zwift: ['device', 'app'],
  suunto: ['device', 'watch'],
  whoop: ['device', 'wearable'],
  oura: ['device', 'wearable'],
  fenix: ['garmin', 'device', 'watch'],
  forerunner: ['garmin', 'device', 'watch'],
  strava: ['app', 'sync'],
  applehealth: ['device', 'sync'],
  apple: ['device'],
}

/**
 * Multi-word phrases that imply concepts their individual tokens don't.
 * Matched against the normalised query before token expansion.
 */
export const PHRASE_ALIASES: readonly { phrase: string; expandsTo: readonly string[] }[] = [
  { phrase: 'stop paying', expandsTo: ['cancel', 'subscription', 'billing'] },
  { phrase: 'how did it feel', expandsTo: ['feedback', 'rpe'] },
  { phrase: 'need attention', expandsTo: ['priority', 'signal'] },
  { phrase: 'not showing', expandsTo: ['missing'] },
  { phrase: 'not show', expandsTo: ['missing'] },
  { phrase: 'coach myself', expandsTo: ['selfcoached'] },
  { phrase: 'link account', expandsTo: ['connect', 'sync'] },
  { phrase: 'add athlete', expandsTo: ['invite', 'roster'] },
  { phrase: 'apple health', expandsTo: ['device', 'sync'] },
  { phrase: 'daily list', expandsTo: ['priority', 'signal'] },
  { phrase: 'priority list', expandsTo: ['priority', 'signal'] },
  { phrase: 'head unit', expandsTo: ['device'] },
  { phrase: 'bike computer', expandsTo: ['device', 'wahoo'] },
  { phrase: '30 days', expandsTo: ['backfill'] },
  { phrase: 'athlete signals', expandsTo: ['signal', 'priority'] },
  { phrase: 'private note', expandsTo: ['note'] },
  { phrase: 'get found', expandsTo: ['directory'] },
  { phrase: 'season plan', expandsTo: ['note'] },
]

function buildLookup(): Map<string, string[]> {
  const lookup = new Map<string, string[]>()
  for (const group of SYNONYM_GROUPS) {
    const stems = group.map(lightStem)
    for (const stem of stems) {
      const others = stems.filter((s) => s !== stem)
      const existing = lookup.get(stem)
      // A stem can legitimately sit in more than one group (e.g. `daily`).
      // Merge rather than overwrite, and dedupe.
      lookup.set(stem, existing ? [...new Set([...existing, ...others])] : others)
    }
  }
  return lookup
}

/** stem -> symmetric synonyms. Built once at module init. */
export const SYNONYM_LOOKUP: ReadonlyMap<string, readonly string[]> = buildLookup()

/** stem -> broader concepts. Keys are stemmed at init so lookups are direct. */
export const HYPERNYM_LOOKUP: ReadonlyMap<string, readonly string[]> = new Map(
  Object.entries(HYPERNYMS).map(([key, values]) => [lightStem(key), values.map(lightStem)]),
)

/** Phrase alias stems, precomputed so the scorer does no string work per keystroke. */
export const PHRASE_ALIAS_STEMS: readonly { stems: string[]; expandsTo: string[] }[] =
  PHRASE_ALIASES.map(({ phrase, expandsTo }) => ({
    stems: phrase.split(/\s+/).map(lightStem),
    expandsTo: expandsTo.map(lightStem),
  }))
