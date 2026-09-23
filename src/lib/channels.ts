import {
  FacebookLogo,
  InstagramLogo,
  LinkedinLogo,
  Megaphone,
  TelegramLogo,
  UsersThree,
  WhatsappLogo,
  XLogo,
} from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import type { Channel } from '@/types/api'

export const CHANNEL_META: Record<Channel, { label: string; icon: Icon }> = {
  updatebase: { label: 'updatebase', icon: Megaphone },
  'whatsapp-channel': { label: 'whatsapp channel', icon: WhatsappLogo },
  'whatsapp-group': { label: 'whatsapp group', icon: UsersThree },
  x: { label: 'x', icon: XLogo },
  linkedin: { label: 'linkedin', icon: LinkedinLogo },
  instagram: { label: 'instagram', icon: InstagramLogo },
  facebook: { label: 'facebook', icon: FacebookLogo },
  telegram: { label: 'telegram', icon: TelegramLogo },
}

export const ALL_CHANNELS = Object.keys(CHANNEL_META) as Channel[]
