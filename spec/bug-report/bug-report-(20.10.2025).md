|**ошибка**|**приоритет**|
|-|-|
|при запуске приложения выдаёт ошибки|высокий|


уточнение:
ERROR in src/game/Game.ts:85:26
TS1345: An expression of type 'void' cannot be tested for truthiness.
    83 |         // посчитать нанесённую дамагу
    84 |         // умереть всех причастных
  > 85 |         if (isUpdated && this.userIsOwner()) {
       |                          ^^^^^^^^^^^^^^^^^^
    86 |             //JSON.stringify()
    87 |             this.server.updateScene();
    88 |         }

ERROR in src/game/hero.ts:1:10
TS2614: Module '"../config"' has no exported member 'FPoint'. Did you mean to use 'import FPoint from "../config"' instead?
  > 1 | import { FPoint } from "../config";
      |          ^^^^^^
    2 |
    3 | class CharacterClass {
    4 |     constructor(

ERROR in src/game/map.ts:1:10
TS2614: Module '"../config"' has no exported member 'FPoint'. Did you mean to use 'import FPoint from "../config"' instead?
  > 1 | import { FPoint } from "../config";
      |          ^^^^^^
    2 |
    3 | export class Map {
    4 |     private walls: FPoint[];

ERROR in src/game/types/Units.ts:8:13
TS2564: Property 'x' has no initializer and is not definitely assigned in the constructor.
     6 |
     7 | class Unit {
  >  8 |     private x: number;
       |             ^
     9 |     private y: number;
    10 |     private width: number;
    11 |     private height: number;

ERROR in src/game/types/Units.ts:9:13
TS2564: Property 'y' has no initializer and is not definitely assigned in the constructor.
     7 | class Unit {
     8 |     private x: number;
  >  9 |     private y: number;
       |             ^
    10 |     private width: number;
    11 |     private height: number;
    12 |     private direction: Direction = EDIRECTION.RIGHT;

ERROR in src/game/types/Units.ts:10:13
TS2564: Property 'width' has no initializer and is not definitely assigned in the constructor.
     8 |     private x: number;
     9 |     private y: number;
  > 10 |     private width: number;
       |             ^^^^^
    11 |     private height: number;
    12 |     private direction: Direction = EDIRECTION.RIGHT;
    13 |     public name: string;

ERROR in src/game/types/Units.ts:11:13
TS2564: Property 'height' has no initializer and is not definitely assigned in the constructor.
     9 |     private y: number;
    10 |     private width: number;
  > 11 |     private height: number;
       |             ^^^^^^
    12 |     private direction: Direction = EDIRECTION.RIGHT;
    13 |     public name: string;
    14 |     public health: number;

ERROR in src/game/types/Units.ts:13:12
TS2564: Property 'name' has no initializer and is not definitely assigned in the constructor.
    11 |     private height: number;
    12 |     private direction: Direction = EDIRECTION.RIGHT;
  > 13 |     public name: string;
       |            ^^^^
    14 |     public health: number;
    15 |     public damage: number;
    16 |     public speed: number;

ERROR in src/game/types/Units.ts:14:12
TS2564: Property 'health' has no initializer and is not definitely assigned in the constructor.
    12 |     private direction: Direction = EDIRECTION.RIGHT;
    13 |     public name: string;
  > 14 |     public health: number;
       |            ^^^^^^
    15 |     public damage: number;
    16 |     public speed: number;
    17 |

ERROR in src/game/types/Units.ts:15:12
TS2564: Property 'damage' has no initializer and is not definitely assigned in the constructor.
    13 |     public name: string;
    14 |     public health: number;
  > 15 |     public damage: number;
       |            ^^^^^^
    16 |     public speed: number;
    17 |
    18 |     constructor() {

ERROR in src/game/types/Units.ts:16:12
TS2564: Property 'speed' has no initializer and is not definitely assigned in the constructor.
    14 |     public health: number;
    15 |     public damage: number;
  > 16 |     public speed: number;
       |            ^^^^^
    17 |
    18 |     constructor() {
    19 |

ERROR in src/game/types/Units.ts:38:57
TS2304: Cannot find name 'FPoint'.
    36 |     }
    37 |
  > 38 |     check_collision(heroX: number, heroY: number, wall: FPoint): boolean {
       |                                                         ^^^^^^
    39 |         const heroPos = this.hero.getPosition();
    40 |         return ((heroX + heroPos.width) > wall.x) &&
    41 |             (heroX < (wall.x + wall.width)) &&

ERROR in src/game/types/Units.ts:39:30
TS2339: Property 'hero' does not exist on type 'Unit'.
    37 |
    38 |     check_collision(heroX: number, heroY: number, wall: FPoint): boolean {
  > 39 |         const heroPos = this.hero.getPosition();
       |                              ^^^^
    40 |         return ((heroX + heroPos.width) > wall.x) &&
    41 |             (heroX < (wall.x + wall.width)) &&
    42 |             ((heroY + heroPos.height) > wall.y) &&

ERROR in src/game/types/Units.ts:46:33
TS2304: Cannot find name 'FPoint'.
    44 |     }
    45 |
  > 46 |     check_rect_collision(rect1: FPoint, rect2: FPoint): boolean {
       |                                 ^^^^^^
    47 |         return (rect1.x + rect1.width > rect2.x) &&
    48 |             (rect1.x < rect2.x + rect2.width) &&
    49 |             (rect1.y + rect1.height > rect2.y) &&

ERROR in src/game/types/Units.ts:46:48
TS2304: Cannot find name 'FPoint'.
    44 |     }
    45 |
  > 46 |     check_rect_collision(rect1: FPoint, rect2: FPoint): boolean {
       |                                                ^^^^^^
    47 |         return (rect1.x + rect1.width > rect2.x) &&
    48 |             (rect1.x < rect2.x + rect2.width) &&
    49 |             (rect1.y + rect1.height > rect2.y) &&

ERROR in src/pages/Game/Game.tsx:8:18
TS2307: Cannot find module '../../game/types/Unit' or its corresponding type declarations.
     6 | import Game from '../../game/Game';
     7 | import Canvas from '../../services/canvas/Canvas';
  >  8 | import Unit from '../../game/types/Unit';
  >  8 | import Unit from '../../game/types/Unit';
  >  8 | import Unit from '../../game/types/Unit';
  >  8 | import Unit from '../../game/types/Unit';
  >  8 | import Unit from '../../game/types/Unit';
  >  8 | import Unit from '../../game/types/Unit';
       |                  ^^^^^^^^^^^^^^^^^^^^^^^
     9 | import useCanvas from '../../services/canvas/useCanvas';
    10 | import useSprites from './hooks/useSprites';
    11 |
  >  8 | import Unit from '../../game/types/Unit';
       |                  ^^^^^^^^^^^^^^^^^^^^^^^
  >  8 | import Unit from '../../game/types/Unit';
  >  8 | import Unit from '../../game/types/Unit';
  >  8 | import Unit from '../../game/types/Unit';
       |                  ^^^^^^^^^^^^^^^^^^^^^^^
  >  8 | import Unit from '../../game/types/Unit';
  >  8 | import Unit from '../../game/types/Unit';
  >  8 | import Unit from '../../game/types/Unit';
  >  8 | import Unit from '../../game/types/Unit';
       |                  ^^^^^^^^^^^^^^^^^^^^^^^
  >  8 | import Unit from '../../game/types/Unit';
  >  8 | import Unit from '../../game/types/Unit';
       |                  ^^^^^^^^^^^^^^^^^^^^^^^
     9 | import useCanvas from '../../services/canvas/useCanvas';
    10 | import useSprites from './hooks/useSprites';
    11 |