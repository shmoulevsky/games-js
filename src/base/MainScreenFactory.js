import {MainScreen as MainScreen00001} from "../games/00001/Screens/MainScreen"
import {MainScreen as MainScreen00002} from "../games/00002/Screens/MainScreen"
import {MainScreen as MainScreen00003} from "../games/00003/Screens/MainScreen"
import {MainScreen as MainScreen00004} from "../games/00004/Screens/MainScreen"
import {MainScreen as MainScreen00005} from "../games/00005/Screens/MainScreen"
import {MainScreen as MainScreen00006} from "../games/00006/Screens/MainScreen"
import {MainScreen as MainScreen00007} from "../games/00007/Screens/MainScreen"
import {MainScreen as MainScreen00008} from "../games/00008/Screens/MainScreen"
import {MainScreen as MainScreen00009} from "../games/00009/Screens/MainScreen"
import {MainScreen as MainScreen00010} from "../games/00010/Screens/MainScreen"
import {MainScreen as MainScreen00011} from "../games/00011/Screens/MainScreen"
import {MainScreen as MainScreen00012} from "../games/00012/Screens/MainScreen"
import {MainScreen as MainScreen00013} from "../games/00013/Screens/MainScreen"
import {MainScreen as MainScreen00014} from "../games/00014/Screens/MainScreen"
import {MainScreen as MainScreen00015} from "../games/00015/Screens/MainScreen"
import {MainScreen as MainScreen00016} from "../games/00016/Screens/MainScreen"
import {MainScreen as MainScreen00017} from "../games/00017/Screens/MainScreen"
import {MainScreen as MainScreen00018} from "../games/00018/Screens/MainScreen"
import {MainScreen as MainScreen00019} from "../games/00019/Screens/MainScreen"
import {MainScreen as MainScreen00020} from "../games/00020/Screens/MainScreen"
import {MainScreen as MainScreen00021} from "../games/00021/Screens/MainScreen"
import {MainScreen as MainScreen00022} from "../games/00022/Screens/MainScreen"
import {MainScreen as MainScreen00023} from "../games/00023/Screens/MainScreen"
import {MainScreen as MainScreen00024} from "../games/00024/Screens/MainScreen"
import {MainScreen as MainScreen00025} from "../games/00025/Screens/MainScreen"

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
            case '00022' : return new MainScreen00022(bg, game, hero);
            case '00023' : return new MainScreen00023(bg, game, hero);
            case '00024' : return new MainScreen00024(bg, game, hero);
            case '00025' : return new MainScreen00025(bg, game, hero);
        }

    }

}