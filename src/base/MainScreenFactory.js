import {MainScreen as MainScreen00001} from "../Primery/plus/Screens/MainScreen"
import {MainScreen as MainScreen00002} from "../Primery/multy/Screens/MainScreen"
import {MainScreen as MainScreen00003} from "../Denesh/find/Screens/MainScreen"
import {MainScreen as MainScreen00004} from "../Denesh/findAll/Screens/MainScreen"
import {MainScreen as MainScreen00005} from "../QuickSort/figurs/Screens/MainScreen"
import {MainScreen as MainScreen00006} from "../Shulte/simple/Screens/MainScreen"
import {MainScreen as MainScreen00007} from "../Shulte/digits/Screens/MainScreen"
import {MainScreen as MainScreen00008} from "../Memory/simple/Screens/MainScreen"
import {MainScreen as MainScreen00009} from "../Sort/figurs/Screens/MainScreen"
import {MainScreen as MainScreen00010} from "../Series/find/Screens/MainScreen"
import {MainScreen as MainScreen00011} from "../Series/digits/Screens/MainScreen"
import {MainScreen as MainScreen00012} from "../Count/simple/Screens/MainScreen"
import {MainScreen as MainScreen00013} from "../Primery/color/Screens/MainScreen"
import {MainScreen as MainScreen00014} from "../Sort/digits/Screens/MainScreen"
import {MainScreen as MainScreen00015} from "../FindAll/letters/Screens/MainScreen"
import {MainScreen as MainScreen00016} from "../Memory/pair/Screens/MainScreen"
import {MainScreen as MainScreen00017} from "../Turtle/simple/Screens/MainScreen"
import {MainScreen as MainScreen00018} from "../Turtle/map/Screens/MainScreen"
import {MainScreen as MainScreen00019} from "../World/map/Screens/MainScreen"
import {MainScreen as MainScreen00020} from "../Order/simple/Screens/MainScreen"
import {MainScreen as MainScreen00021} from "../Dots/simple/Screens/MainScreen"

export default class MainScreenFactory{

    make(code, bg, game, hero){

        switch (code){
            case '00001' : return new MainScreen00001(bg, game, hero);
            case '00002' : return new MainScreen00002(bg, game, hero);
            case '00003' : return new MainScreen00003(bg, game, hero);
            case '00004' : return new MainScreen00004(bg, game, hero);
            case '00005' : return new MainScreen00005(bg, game, hero);
            case '00006' : return new MainScreen00006(bg, game, hero);
            case '00007' : return new MainScreen00007(bg, game, hero);
            case '00008' : return new MainScreen00008(bg, game, hero);
            case '00009' : return new MainScreen00009(bg, game, hero);
            case '00010' : return new MainScreen00010(bg, game, hero);
            case '00011' : return new MainScreen00011(bg, game, hero);
            case '00012' : return new MainScreen00012(bg, game, hero);
            case '00013' : return new MainScreen00013(bg, game, hero);
            case '00014' : return new MainScreen00014(bg, game, hero);
            case '00015' : return new MainScreen00015(bg, game, hero);
            case '00016' : return new MainScreen00016(bg, game, hero);
            case '00017' : return new MainScreen00017(bg, game, hero);
            case '00018' : return new MainScreen00018(bg, game, hero);
            case '00019' : return new MainScreen00019(bg, game, hero);
            case '00020' : return new MainScreen00020(bg, game, hero);
            case '00021' : return new MainScreen00021(bg, game, hero);
        }

    }

}