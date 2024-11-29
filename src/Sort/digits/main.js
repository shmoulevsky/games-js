import GameManager from "../../base/GameManager";
import DefaultSettings from "../../base/Settings/DefaultSettings";
import AssetManager from "../../base/Asset/AssetManager";


let options = null

let code = '00014'
let assetManager = new AssetManager()

let bg = assetManager.getBackground()
let startBg = assetManager.getStartBackground()
let settingsBg = assetManager.getSettingsBackground()
let winBg = assetManager.getWinBackground()
let hero = assetManager.getHero()
let settings = new DefaultSettings()
let gameManager = new GameManager()

gameManager.init(options, settings, bg, startBg, settingsBg, winBg, hero, code)