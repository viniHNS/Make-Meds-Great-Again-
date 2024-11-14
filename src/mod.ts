import { DependencyContainer } from "tsyringe";
import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { IPreSptLoadMod } from "@spt/models/external/IPreSptLoadMod";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";
import { JsonUtil } from "@spt/utils/JsonUtil";
import { VFS } from "@spt/utils/VFS";
import { ImporterUtil } from "@spt/utils/ImporterUtil";
import path from "path";
import { IDHelper } from "./IDHelper";
import config from "../config/config.json"
import paracetamol from "../db/buffs/paracetamol.json"
import exodrine from "../db/buffs/exodrine.json"

class Mod implements IPostDBLoadMod, IPreSptLoadMod
{
    preSptLoad(container: DependencyContainer): void 
    {
        // get the logger from the server container
        const logger = container.resolve<ILogger>("WinstonLogger");
        logger.logWithColor("[ViniHNS] Making the meds great again!", LogTextColor.GREEN);
    }

    public postDBLoad(container: DependencyContainer): void 
    {
        const logger2 = container.resolve<ILogger>("WinstonLogger");
        // get database from server
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");

        const idHelper = new IDHelper;

        // Get all the in-memory json found in /assets/database
        const tables = databaseServer.getTables();

        function setEffectDamage(item: any, effect: string, configKey: string, config: any): void {
            if (config[configKey]) {
                item._props.effects_damage[effect] = {
                    delay: 0,
                    duration: 0,
                    fadeOut: 0,
                    cost: config[configKey]
                };
            }
        }
    
        function setSurgeryEffect(item: any, configKey: string, config: any): void {
            if (config[configKey]) {
                item._props.effects_damage["DestroyedPart"] = {
                    delay: 0,
                    duration: 0,
                    fadeOut: 0,
                    healthPenaltyMin: 60,
                    healthPenaltyMax: 72,
                    cost: config[configKey]
                };
            }
        }
    
        function applyChanges(item: any, config: any, prefix: string): void {
            setEffectDamage(item, "Fracture", `${prefix}FractureHealCost`, config);
            setSurgeryEffect(item, `${prefix}SurgeryCost`, config);
            setEffectDamage(item, "HeavyBleeding", `${prefix}HeavyBleedingHealCost`, config);
            setEffectDamage(item, "LightBleeding", `${prefix}LightBleedingHealCost`, config);
        }

        const carKitHP: number = config.carKitHP;
        const salewaHP: number = config.salewaHP;
        const ifakHP: number = config.ifakHP;
        const afakHP: number = config.afakHP;
        const grizzlyHP: number = config.grizzlyHP;
        const ai2HP: number = config.ai2HP;
    
        const calocUsage: number = config.calocUsage;
        const armyBandageUsage: number = config.armyBandageUsage;
        const analginPainkillersUsage: number = config.analginPainkillersUsage;
        const augmentinUsage: number = config.augmentinUsage;
        const ibuprofenUsage: number = config.ibuprofenUsage;
        const vaselinUsage: number = config.vaselinUsage;
        const goldenStarUsage: number = config.goldenStarUsage;
        const aluminiumSplintUsage: number = config.aluminiumSplintUsage;
        const cmsUsage: number = config.cmsUsage;
        const survivalKitUsage: number = config.survivalKitUsage;


        // Find the meds item by its Id (thanks NoNeedName)
        const carKit = tables.templates.items[idHelper.CAR_FIRST_AID];
        const salewa = tables.templates.items[idHelper.SALEWA];
        const ifak = tables.templates.items[idHelper.IFAK];
        const afak = tables.templates.items[idHelper.AFAK];
        const grizzly = tables.templates.items[idHelper.GRIZZLY];
        const ai2 = tables.templates.items[idHelper.AI2_MEDKIT];
        const calocB = tables.templates.items[idHelper.CALOC_B];
        const armyBandages = tables.templates.items[idHelper.ARMY_BANDAGE];

        const analginPainkillers = tables.templates.items[idHelper.ANALGIN];
        const augmentin = tables.templates.items[idHelper.AUGMENTIN];
        const ibuprofen = tables.templates.items[idHelper.IBUPROFEN];
        const vaselin = tables.templates.items[idHelper.VASELIN];
        const goldenStar = tables.templates.items[idHelper.GOLDEN_STAR];

        const aluminiumSplint = tables.templates.items[idHelper.ALUMINIUM_SPLINT];

        const survivalKit = tables.templates.items[idHelper.SURVIVAL_KIT];
        const cms = tables.templates.items[idHelper.CMS];

        
        // Changes --------------------------------------------------------------------
        carKit._props.MaxHpResource = carKitHP;
        salewa._props.MaxHpResource = salewaHP;
        ifak._props.MaxHpResource = ifakHP;
        afak._props.MaxHpResource = afakHP;
        grizzly._props.MaxHpResource = grizzlyHP;
        ai2._props.MaxHpResource = ai2HP;

        calocB._props.MaxHpResource = calocUsage;
        armyBandages._props.MaxHpResource = armyBandageUsage;
        analginPainkillers._props.MaxHpResource = analginPainkillersUsage;
        augmentin._props.MaxHpResource = augmentinUsage;
        ibuprofen._props.MaxHpResource = ibuprofenUsage;

        vaselin._props.MaxHpResource = vaselinUsage;
        goldenStar._props.MaxHpResource = goldenStarUsage;
        aluminiumSplint._props.MaxHpResource = aluminiumSplintUsage;
        cms._props.MaxHpResource = cmsUsage;
        survivalKit._props.MaxHpResource = survivalKitUsage;


        if (config.grizzlyChanges) {
            applyChanges(grizzly, config, "Grizzly");
            logger2.logWithColor(`[Making Meds Great Again!] Changing Grizzly`, LogTextColor.GREEN);
        } else {
            grizzly._props.effects_damage["LightBleeding"] = {
                delay: 0,
                duration: 0,
                fadeOut: 0,
                cost: 40
            },
            grizzly._props.effects_damage["HeavyBleeding"] = {
                delay: 0,
                duration: 0,
                fadeOut: 0,
                cost: 130
            },
            grizzly._props.effects_damage["Fracture"] = {
                delay: 0,
                duration: 0,
                fadeOut: 0,
                cost: 50
            },
            grizzly._props.effects_damage["Contusion"] = {
                delay: 0,
                duration: 0,
                fadeOut: 0,
                cost: 0
            },
            grizzly._props.effects_damage["RadExposure"] = {
                delay: 0,
                duration: 0,
                fadeOut: 0,
                cost: 0
            }
            grizzly._props.MaxHpResource = 1800;
            logger2.logWithColor(`[Making Meds Great Again!] Grizzly set to default`, LogTextColor.GREEN);
        }
        
        if (config.ai2Changes) {
            applyChanges(ai2, config, "ai2");
            logger2.logWithColor(`[Making Meds Great Again!] Changing AI-2`, LogTextColor.GREEN);
        } else {
            ai2._props.effects_damage["RadExposure"] = {
                delay: 0,
                duration: 0,
                fadeOut: 0,
                cost: 0
            }
            ai2._props.MaxHpResource = 100;
            logger2.logWithColor(`[Making Meds Great Again!] AI-2 set to default`, LogTextColor.GREEN);
        }
        
        if (config.carKitChanges) {
            applyChanges(carKit, config, "carKit");
            logger2.logWithColor(`[Making Meds Great Again!] Changing Car First Aid Kit`, LogTextColor.GREEN);
        } else {
            carKit._props.effects_damage["LightBleeding"] = {
                delay: 0,
                duration: 0,
                fadeOut: 0,
                cost: 50
            }
            carKit._props.MaxHpResource = 220;
            logger2.logWithColor(`[Making Meds Great Again!] Car First Aid Kit set to default`, LogTextColor.GREEN);
        }
        
        if (config.salewaChanges) {
            applyChanges(salewa, config, "salewa");
            logger2.logWithColor(`[Making Meds Great Again!] Changing Salewa`, LogTextColor.GREEN);
        } else {
            salewa._props.effects_damage["LightBleeding"] = {
                delay: 0,
                duration: 0,
                fadeOut: 0,
                cost: 45
            },
            salewa._props.effects_damage["HeavyBleeding"] = {
                delay: 0,
                duration: 0,
                fadeOut: 0,
                cost: 175
            },
            salewa._props.MaxHpResource = 400;
            logger2.logWithColor(`[Making Meds Great Again!] Salewa set to default`, LogTextColor.GREEN);
        }
        
        if (config.ifakChanges) {
            applyChanges(ifak, config, "ifak");
            logger2.logWithColor(`[Making Meds Great Again!] Changing IFAK`, LogTextColor.GREEN);
        } else {
            ifak._props.effects_damage["LightBleeding"] = {
                delay: 0,
                duration: 0,
                fadeOut: 0,
                cost: 30
            },
            ifak._props.effects_damage["HeavyBleeding"] = {
                delay: 0,
                duration: 0,
                fadeOut: 0,
                cost: 210
            },
            ifak._props.effects_damage["RadExposure"] = {
                delay: 0,
                duration: 0,
                fadeOut: 0,
                cost: 0
            }
            ifak._props.MaxHpResource = 300;
            logger2.logWithColor(`[Making Meds Great Again!] IFAK set to default`, LogTextColor.GREEN);
        }
        
        if (config.afakChanges) {
            applyChanges(afak, config, "afak");
            logger2.logWithColor(`[Making Meds Great Again!] Changing AFAK`, LogTextColor.GREEN);
        } else {
            afak._props.effects_damage["LightBleeding"] = {
                delay: 0,
                duration: 0,
                fadeOut: 0,
                cost: 30
            },
            afak._props.effects_damage["HeavyBleeding"] = {
                delay: 0,
                duration: 0,
                fadeOut: 0,
                cost: 170
            },
            afak._props.effects_damage["RadExposure"] = {
                delay: 0,
                duration: 0,
                fadeOut: 0,
                cost: 0
            }
            afak._props.MaxHpResource = 400;
            logger2.logWithColor(`[Making Meds Great Again!] AFAK set to default`, LogTextColor.GREEN);
        }
        
        // ----------------------------------------------------------------------------

        // Thanks TRON <3
        const logger = container.resolve<ILogger>("WinstonLogger");
        const db = container.resolve<DatabaseServer>("DatabaseServer").getTables();
        const ImporterUtil = container.resolve<ImporterUtil>("ImporterUtil");
        const JsonUtil = container.resolve<JsonUtil>("JsonUtil");
        const VFS = container.resolve<VFS>("VFS");
        const locales = db.locales.global;
        const items = db.templates.items;
        const handbook = db.templates.handbook.Items;
        const modPath = path.resolve(__dirname.toString()).split(path.sep).join("/")+"/";

        const mydb = ImporterUtil.loadRecursive(`${modPath}../db/`);

        const itemPath = `${modPath}../db/templates/items/`;
        const handbookPath = `${modPath}../db/templates/handbook/`;

        const buffs = db.globals.config.Health.Effects.Stimulator.Buffs

        //ID buff paracetamol -> 67150653e2809bdac7054f97
        //ID buff exodrine    -> 67352799ac0f173f618601ff

        buffs["67150653e2809bdac7054f97"] = paracetamol;
        buffs["67352799ac0f173f618601ff"] = exodrine;


        for(const itemFile in mydb.templates.items) {
            const item = JsonUtil.deserialize(VFS.readFile(`${itemPath}${itemFile}.json`));
            const hb = JsonUtil.deserialize(VFS.readFile(`${handbookPath}${itemFile}.json`));

            const itemId = item._id;
            //logger.info(itemId);

            items[itemId] = item;
            //logger.info(hb.ParentId);
            //logger.info(hb.Price);
            handbook.push({
                "Id": itemId,
                "ParentId": hb.ParentId,
                "Price": hb.Price
            });
        }
        for (const trader in mydb.traders.assort) {
            const traderAssort = db.traders[trader].assort
            
            for (const item of mydb.traders.assort[trader].items) {
                traderAssort.items.push(item);
            }
    
            for (const bc in mydb.traders.assort[trader].barter_scheme) {
                traderAssort.barter_scheme[bc] = mydb.traders.assort[trader].barter_scheme[bc];
            }
    
            for (const level in mydb.traders.assort[trader].loyal_level_items) {
                traderAssort.loyal_level_items[level] = mydb.traders.assort[trader].loyal_level_items[level];
            }
        }
        //logger.info("Test");
        // default localization
        for (const localeID in locales)
        {
            for (const id in mydb.locales.en.templates) {
                const item = mydb.locales.en.templates[id];
                //logger.info(item);
                for(const locale in item) {
                    //logger.info(locale);
                    //logger.info(item[locale]);
                    //logger.info(`${id} ${locale}`);
                    locales[localeID][`${id} ${locale}`] = item[locale];
                }
            }

            for (const id in mydb.locales.en.preset) {
                const item = mydb.locales.en.preset[id];
                for(const locale in item) {
                    //logger.info(`${id} ${locale}`);
                    locales[localeID][`${id}`] = item[locale];
                }
            }
        }

        for (const localeID in mydb.locales)
        {
            for (const id in mydb.locales[localeID].templates) {
                const item = mydb.locales[localeID].templates[id];
                //logger.info(item);
                for(const locale in item) {
                    locales[localeID][`${id}`] = item[locale];
                }
            }

            for (const id in mydb.locales[localeID].preset) {
                const item = mydb.locales[localeID].preset[id];
                for(const locale in item) {
                    //logger.info(`${id} ${locale}`);
                    locales[localeID][`${id} ${locale}`] = item[locale];
                }
                
            }

        }

        logger.logWithColor("[Making the meds great again!] Loading complete.", LogTextColor.GREEN);

    }

}

module.exports = { mod: new Mod() }