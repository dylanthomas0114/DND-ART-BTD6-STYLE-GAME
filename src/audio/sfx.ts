/** Sound effect hooks; implemented in M6 (code-generated ZzFX sounds). */
export type SfxName =
  | 'pop'
  | 'popBig'
  | 'immune'
  | 'place'
  | 'upgrade'
  | 'sell'
  | 'shoot'
  | 'bow'
  | 'blade'
  | 'magic'
  | 'boom'
  | 'freeze'
  | 'beam'
  | 'leak'
  | 'roundStart'
  | 'roundEnd'
  | 'ability'
  | 'coin'
  | 'click'
  | 'error'
  | 'win'
  | 'lose';

export function playSfx(_name: SfxName, _volume = 1): void {
  /* replaced by the audio engine */
}
