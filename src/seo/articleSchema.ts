import augoFooterLogoUrl from '../assets/images/augo_footer_1.svg'
import {
  buildArticleSchema as buildArticleSchemaShared,
  type ArticleSchemaInput,
} from './articleSchema.shared.ts'

export type { ArticleSchemaInput }

export function buildArticleSchema(input: ArticleSchemaInput) {
  return buildArticleSchemaShared({
    ...input,
    publisherLogoUrl: augoFooterLogoUrl,
  })
}
