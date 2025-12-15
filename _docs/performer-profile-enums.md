# Enumeradores usados en el `PerformerProfile` (perfil de performer)

Este documento recoge los enumeradores que se usan en los campos del perfil del performer (creación/actualización/lectura) y su mapeo numérico, para facilitar la interpretación en Swagger (donde actualmente sólo se muestran números).

> Ubicación del código con la definición: `src/performers/enums/profile.enums.ts`

## Campos que usan enumeradores
- ethnicity
- sexualPreference
- zodiac
- hairColor
- eyeColor
- pubicHair
- build
- bust
- bustName
- appStatus

---

## ZodiacType
| Nombre | Valor |
|---|---:|
| Aries | 0 |
| Taurus | 1 |
| Gemini | 2 |
| Cancer | 3 |
| Leo | 4 |
| Virgo | 5 |
| Libra | 6 |
| Scorpio | 7 |
| Saggitarius | 8 |
| Capricorn | 9 |
| Aquarius | 10 |
| Pisces | 11 |

## EyeColorType
| Nombre | Valor |
|---|---:|
| Blue | 0 |
| Green | 1 |
| Hazel | 2 |
| Brown | 3 |
| Grey | 4 |

## HairColorType
| Nombre | Valor |
|---|---:|
| Blond | 0 |
| Red | 1 |
| Brown | 2 |
| Black | 3 |
| White | 4 |
| Silver | 5 |
| SaltAndPepper | 6 |
| Dyed | 7 |

## SexualPreferenceType
| Nombre | Valor |
|---|---:|
| Straight | 0 |
| Gay | 1 |
| Bisexual | 2 |

## PubicHairType
| Nombre | Valor |
|---|---:|
| Bald | 0 |
| Hairy | 1 |
| Trimmed | 2 |

## BuildType
| Nombre | Valor |
|---|---:|
| Slender | 0 |
| Petite | 1 |
| Athletic | 2 |
| Muscular | 3 |
| Curvaceous | 4 |
| Few_extra_pounds | 5 |
| Big_beautiful_woman | 6 |

## EthnicityType
| Nombre | Valor |
|---|---:|
| White | 0 |
| Black | 1 |
| Hispanic | 2 |
| Asian | 3 |
| East_Indian | 4 |
| Native_American | 5 |
| Middle_Eastern | 6 |
| Pacific_Islander | 7 |
| Mediterranean | 8 |
| European | 9 |
| Roma | 10 |

## BustType
| Nombre | Valor |
|---|---:|
| A | 0 |
| B | 1 |
| C | 2 |
| D | 3 |
| DDE | 4 |
| DDDF | 5 |
| G | 6 |
| H | 7 |
| I | 8 |
| J | 9 |
| K_Plus | 10 |

## AppStatusType
| Nombre | Valor |
|---|---:|
| Offline | 0 |
| OnWebApp | 1 |
| OnMobile | 2 |
| Busy | 3 |

---

Notas:
- Las definiciones están además incluidas en `src/performers/enums/profile.enums.ts` como enums TypeScript exportados; Swagger ahora mostrará esas opciones en la documentación (gracias a los `@ApiProperty({ enum: ... })`).
- Los endpoints del perfil (`GET :id/profile`, `POST :id/profile`, `PATCH :id/profile`) incluyen una referencia en su descripción a este fichero y listan los campos enumerados.

Si quieres, puedo también:
- Añadir ejemplos en los `@ApiBody` de los controladores con valores explícitos (p. ej. `ethnicity: 0 /* White */`) para hacerlos más legibles.
- Añadir validaciones (p. ej. `IsEnum(...)`) en los DTOs para forzar valores válidos en runtime.

✅ Dime qué prefieres y lo implemento.