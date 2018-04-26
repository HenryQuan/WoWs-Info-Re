import { Platform, Alert } from 'react-native';
import { IOSData, LocalData, SavedData, VERSION } from '../constant/value';
import { BLUE } from 'react-native-material-color';
import { Language, GameVersion, DateCalculator, PlayerConverter, ServerManager } from './';
import store from 'react-native-simple-store';
import { DataManager } from './';

class DataStorage {
  static async DataValidation() {
    try {
      // Setting up Data here      
      let first = await store.get(LocalData.first_launch);
     
      if (first == null) {
        console.log('First Launch\nWelcome to WoWs Info >_<');
        await DataStorage.SetupAllData();
      } else {
        console.log('Welcome back');
        global.first_launch = false; 
        // Check for App Update
        let appVersion = await store.get(LocalData.curr_version);
        if (appVersion != VERSION) await this.SetupAdditionalData();

        // Restore essential loca data
        await DataStorage.RestoreData();
        let saved = global.game_version;
        let curr = await GameVersion.getCurrVersion();
        console.log('Game Version\nCurr: ' + curr + '\nSaved: ' + saved);
        if (curr != saved) {
          await DataManager.UpdateLocalData();
          await store.save(LocalData.game_version, curr);
        } else {
          await DataStorage.RestoreSavedData();
        }
  
        let date = await store.get(LocalData.date);
        // A new day?
        if (DateCalculator.isNewDay(date)) {
          console.log('A new day...');
          
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  //
  // Setup data
  //

  static async SetupAllData() {
    await DataStorage.SetupLocalStorage();
    await DataStorage.RestoreData();
    await DataManager.UpdateLocalData();
  }

  static async SetupAdditionalData() {
    // Update wows info version
    await store.save(LocalData.curr_version, VERSION);
  }

  static async SetupLocalStorage() {
    try {   
      console.log('Local Storage');

      // Change this before version update
      await store.save(LocalData.curr_version, VERSION);

      await store.save(LocalData.friend, {'2011774448': {name: 'HenryQuan', id: '2011774448', server: '3'}});
      await store.save(LocalData.user_info, {name: '', id: '', server: ''});
      await store.save(LocalData.userdata, {});

      let version = await GameVersion.getCurrVersion();
      await store.save(LocalData.game_version, version);

      await store.save(LocalData.date, DateCalculator.getCurrDate());
      await store.save(LocalData.server, 3);
      await DataStorage.SetupTheme();
      await store.save(LocalData.has_ads, true);
      await store.save(LocalData.data_saver, false);

      let lang = Language.getCurrentLanguage();
      await store.save(LocalData.api_language, lang);
      // Check for userdefault ios
      if (Platform.OS == 'ios') await DataStorage.SetupIOSData(); 
      // Finish setup
      await store.save(LocalData.first_launch, false);
    } catch (error) {
      console.error(error);
    }
  }

  static async SetupIOSData() {
    var UserDefaults = require('react-native-userdefaults-ios');
    let data = await UserDefaults.objectForKey(IOSData.first_launch);
    if (data != null) {
      console.log('Retrieving userdefault...');
      let server = await UserDefaults.stringForKey(IOSData.server);
      await store.save(LocalData.server, server);
      
      let pro = await UserDefaults.objectForKey(IOSData.has_purchased);     
      if (pro) await store.save(LocalData.has_ads, false);
      
      let username = await UserDefaults.stringForKey(IOSData.username);       
      if (username != '>_<') {
        var playerObj = PlayerConverter.fromString(username);
        playerObj.access_token = '';
        playerObj.created_at = '';
        await store.save(LocalData.user_info, playerObj);
      }

      let friend = await UserDefaults.objectForKey(IOSData.friend);
      if (friend != null) {
        var playerList = {};
        for (var i = 0; i < friend.length; i++) {
          let obj = PlayerConverter.fromString(friend[i]);
          playerList[obj.id] = obj;
        }
        global.friend = playerList;
        await store.save(LocalData.friend, playerList);
      }
    }
  }

  static async SetupTheme() {
    // Theme Red Blue Green
    global.theme = BLUE;
    await store.save(LocalData.theme, BLUE);
  }

  //
  // Restore data section
  //

  static async RestoreTheme() {
    global.theme = await store.get(LocalData.theme); 
    if (global.theme == null) await DataStorage.SetupTheme();
  }

  static async RestoreData() {
    global.theme = await store.get(LocalData.theme);    
    global.server = await store.get(LocalData.server);
    global.domain = ServerManager.domainName(global.server);
    global.api_language = await store.get(LocalData.api_language);
    global.game_version = await store.get(LocalData.game_version);
    global.friend = await store.get(LocalData.friend);
    global.data_saver = await store.get(LocalData.data_saver);
    DataStorage.RestorePlayerInfo();
  }

  static async RestorePlayerInfo() {
    global.ads = await store.get(LocalData.has_ads);
    global.user_info = await store.get(LocalData.user_info);
    global.user_data = await store.get(LocalData.userdata);
  }

  static async RestoreSavedData() {
    global.data.language = await store.get(SavedData.language);
    global.data.achievement = await store.get(SavedData.achievement);
    global.data.consumable = await store.get(SavedData.consumable);
    global.data.encyclopedia = await store.get(SavedData.encyclopedia);
    global.data.collection = await store.get(SavedData.collection);
    global.data.collection_item = await store.get(SavedData.collection_item);
    global.data.ship_type = await store.get(SavedData.ship_type);
    global.data.warship = await store.get(SavedData.warship);
    global.data.commander = await store.get(SavedData.commander_skill);
    global.data.map = await store.get(SavedData.map);
    global.data.personal_rating = await store.get(SavedData.personal_rating);
    console.log('SavedData\n' + global.data);
  }
}

export { DataStorage };