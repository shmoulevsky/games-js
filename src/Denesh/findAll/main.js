import GameManager from "../../base/GameManager";
import DefaultSettings from "../../base/Settings/DefaultSettings";
import AssetManager from "../../base/Asset/AssetManager";


let options = null

let code = '00004'
let assetManager = new AssetManager()

let env = assetManager.getEnviroment('ice')
let bg = env.bg
let startBg = assetManager.getStartBackground()
let settingsBg = assetManager.getSettingsBackground()
let winBg = assetManager.getWinBackground()
let hero = env.hero
let settings = new DefaultSettings()
let gameManager = new GameManager()

gameManager.init(options, settings, bg, startBg, settingsBg, winBg, hero, code)