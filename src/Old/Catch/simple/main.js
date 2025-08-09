import GameManager from "../../base/GameManager";
import DefaultSettings from "../../base/Settings/DefaultSettings";
import AssetManager from "../../base/Asset/AssetManager";


let options = [
    [
        {title: '+', value: 'plus'},
        {title: '-', value: 'minus'},
        {title: '*', value: 'multiply'},
    ],
    [
        {title: '1-5', value: {min: 1, max: 5}},
        {title: '1-10', value: {min: 1, max: 10}},
        {title: '1-20', value: {min: 1, max: 20}},
        {title: '1-50', value: {min: 1, max: 50}},
    ]
]

let code = '00023'
let assetManager = new AssetManager()

let env = assetManager.getEnviroment('bg')
let bg = env.bg
let hero = env.hero

let startBg = assetManager.getStartBackground()
let settingsBg = assetManager.getSettingsBackground()
let winBg = assetManager.getWinBackground()
let settings = new DefaultSettings()
let gameManager = new GameManager()


gameManager.init(options, settings, bg, startBg, settingsBg, winBg, hero, code)