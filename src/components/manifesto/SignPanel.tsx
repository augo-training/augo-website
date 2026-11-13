import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { isValidEmail } from '../../utils/email'
import { identifyEmailCapture, trackManifestoSigned, trackManifestoSignError } from '../../utils/analytics'
import { signManifesto } from './api'
import { COPY, MANIFESTO_PATH, NAME_MAX, type Signature, type SignerRole } from './constants'
import { layoutSignatures, WIDE_GRID } from './layout'
import { inkStyle } from './ink'
import { cleanName, isValidName, todayIso } from './signatures'

interface SignPanelProps {
    open: boolean
    onClose: () => void
    onSigned: (signature: Signature) => void
}

type FieldError = 'name' | 'email' | 'role' | 'submit' | null

const inputClass =
    'w-full rounded-lg bg-dark-700 border border-dark-600 px-4 py-3 text-white text-[16px] placeholder:text-dark-400 outline-none focus:border-dark-200 transition-colors'

/**
 * The sign form, in a dialog over the sheet. Name, email and coach or athlete;
 * only the name is ever shown. As the visitor types, the name is written out
 * in the same hand it will have on the sheet.
 *
 * Off the paper, so the site's text rule applies: white and grey on dark. The
 * red is only in the preview strip, which is a scrap of the sheet.
 */
export default function SignPanel({ open, onClose, onSigned }: SignPanelProps) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [role, setRole] = useState<SignerRole | null>(null)
    const [error, setError] = useState<FieldError>(null)
    const [submitting, setSubmitting] = useState(false)
    const nameRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (!open) return
        nameRef.current?.focus()
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose()
        }
        const overflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        window.addEventListener('keydown', onKey)
        return () => {
            document.body.style.overflow = overflow
            window.removeEventListener('keydown', onKey)
        }
    }, [open, onClose])

    const today = todayIso()
    const preview = cleanName(name)
    // The same seed the sheet uses, so the preview is in the hand the name will get.
    const font = useMemo(
        () => layoutSignatures([{ name: preview, signedAt: today }], WIDE_GRID).placements[0].font,
        [preview, today],
    )

    if (!open) return null

    const submit = async (event: FormEvent) => {
        event.preventDefault()
        if (submitting) return
        if (!isValidName(name)) return setError('name')
        if (!isValidEmail(email)) return setError('email')
        if (!role) return setError('role')
        setError(null)
        setSubmitting(true)

        const signature: Signature = { name: cleanName(name), role, signedAt: today }
        const result = await signManifesto({ name: signature.name, email, role, signedAt: today })
        setSubmitting(false)
        if (result !== 'ok') {
            setError('submit')
            void trackManifestoSignError({ role })
            return
        }
        void identifyEmailCapture({ email, source: 'manifesto', page: MANIFESTO_PATH })
        void trackManifestoSigned({ role })
        onSigned(signature)
    }

    const errorText =
        error === 'name'
            ? COPY.errorName
            : error === 'email'
              ? COPY.errorEmail
              : error === 'role'
                ? COPY.errorRole
                : error === 'submit'
                  ? COPY.errorSubmit
                  : null

    return (
        <div
            className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="manifesto-sign-title"
                className="relative w-full sm:max-w-[460px] rounded-t-2xl sm:rounded-2xl bg-dark-800 border border-dark-600 px-6 pt-7 pb-8 sm:px-8"
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label={COPY.close}
                    className="absolute right-4 top-4 p-2 text-dark-200 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <h2 id="manifesto-sign-title" className="font-satoshi font-bold text-white text-[26px] leading-tight">
                    {COPY.panelTitle}
                </h2>
                <p className="mt-1 text-text-muted text-[15px]">{COPY.panelLead}</p>

                {/* The preview strip: a scrap of the sheet with the name in ink. */}
                <div className="mt-5 h-[84px] rounded-md bg-[#F7F5F0] flex items-center justify-center gap-2 px-4 overflow-hidden">
                    {preview ? (
                        <span className="truncate" style={{ ...inkStyle(font, 34), lineHeight: 1.2 }}>
                            {preview}
                        </span>
                    ) : (
                        <span className="font-mono text-[12px] uppercase tracking-[1px] text-[#9A9A9A]">
                            {COPY.previewEmpty}
                        </span>
                    )}
                </div>

                <form className="mt-5 flex flex-col gap-4" onSubmit={submit} noValidate>
                    <label className="flex flex-col gap-1.5">
                        <span className="font-mono text-[11px] uppercase tracking-[1.5px] text-dark-200">
                            {COPY.nameLabel}
                        </span>
                        <input
                            ref={nameRef}
                            className={inputClass}
                            value={name}
                            maxLength={NAME_MAX + 10}
                            autoComplete="name"
                            placeholder={COPY.namePlaceholder}
                            aria-invalid={error === 'name'}
                            onChange={(event) => setName(event.target.value)}
                        />
                    </label>
                    <label className="flex flex-col gap-1.5">
                        <span className="font-mono text-[11px] uppercase tracking-[1.5px] text-dark-200">
                            {COPY.emailLabel}
                        </span>
                        <input
                            className={inputClass}
                            type="email"
                            value={email}
                            autoComplete="email"
                            inputMode="email"
                            placeholder={COPY.emailPlaceholder}
                            aria-invalid={error === 'email'}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </label>
                    <fieldset className="flex flex-col gap-1.5">
                        <legend className="font-mono text-[11px] uppercase tracking-[1.5px] text-dark-200 mb-1.5">
                            {COPY.roleLabel}
                        </legend>
                        <div className="grid grid-cols-2 gap-2">
                            {(Object.keys(COPY.roles) as SignerRole[]).map((value) => (
                                <button
                                    key={value}
                                    type="button"
                                    aria-pressed={role === value}
                                    onClick={() => setRole(value)}
                                    className={`rounded-lg border px-4 py-3 text-[15px] transition-colors ${
                                        role === value
                                            ? 'border-white bg-dark-600 text-white'
                                            : 'border-dark-600 bg-dark-700 text-text-muted hover:border-dark-400'
                                    }`}
                                >
                                    {COPY.roles[value]}
                                </button>
                            ))}
                        </div>
                    </fieldset>

                    <p className="text-[13px] text-dark-200 leading-snug">{COPY.privacy}</p>
                    {errorText && (
                        <p role="alert" className="text-[14px] text-white">
                            {errorText}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="btn-gradient mt-1 h-12 rounded-lg font-mono text-sm font-extrabold tracking-[2px] uppercase text-white hover:brightness-110 transition-all disabled:opacity-60"
                    >
                        {submitting ? COPY.submitting : COPY.submit}
                    </button>
                </form>
            </div>
        </div>
    )
}
