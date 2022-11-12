import { Context, h, Schema } from 'koishi'
import zh from './locales/zh.yml'

export interface Config {
  token?: string
}

export const Config: Schema<Config> = Schema.object({
  token: Schema.string().description('Telegram 机器人令牌。'),
})

export const name = 'tgsticker'

export function apply(ctx: Context, config: Config) {
  ctx.i18n.define('zh', zh)

  ctx.command('tgsticker <name:string>', { checkArgCount: true })
    .alias('tgs')
    .action(async ({ session }, name) => {
      const data = await ctx.http.get(`https://api.telegram.org/bot${config.token}/getStickerSet`, {
        params: { name },
      })
      if (!data.ok) return data.description
      return h('message', { forward: true }, [
        session.text('.output', data.result),
        ...data.result.stickers.map((sticker) => h.image(`https://api.telegram.org/file/bot${config.token}/${sticker.file_id}`)),
      ])
    })
}
