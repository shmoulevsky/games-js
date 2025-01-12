import GameManager from "../../base/GameManager";
import DefaultSettings from "../../base/Settings/DefaultSettings";
import AssetManager from "../../base/Asset/AssetManager";


let options = [
    {title : '1-10', value : {min:1 , max:10}},
    {title : '1-15', value : {min:1 , max:15}},
    {title : '1-20', value : {min:1 , max:20}},
    {title : '1-25', value : {min:1 , max:15}},
    {title : '1-100', value : {min:1 , max:100}}
]

let code = '00002'
let assetManager = new AssetManager()

let env = assetManager.getEnviroment('forest')
let bg = env.bg
let startBg = assetManager.getStartBackground()
let settingsBg = assetManager.getSettingsBackground()
let winBg = assetManager.getWinBackground()
let hero = env.hero
let settings = new DefaultSettings()
let gameManager = new GameManager()
gameManager.init(options, settings, bg, startBg, settingsBg, winBg, hero, code)