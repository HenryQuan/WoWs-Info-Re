/**
 * Menu.js
 * 
 * Menu shows wiki and extra
 * It also has the ability to search players and clans
 */

import React, { PureComponent } from 'react';
import { Alert, ScrollView, StyleSheet, Linking, View } from 'react-native';
import { isAndroid } from 'react-native-device-detection';
import { List, Colors, FAB, Button } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { WoWsInfo, SectionTitle, AppName } from '../../component';
import { lang } from '../../value/lang';
import { SafeAction, Downloader } from '../../core';
import { ThemeBackColour, TintColour } from '../../value/colour';
import { getCurrDomain, getCurrServer, getCurrPrefix, LOCAL, getFirstLaunch, setFirstLaunch, setLastLocation, SAVED, isProVersion, onlyProVersion, validateProVersion } from '../../value/data';
import { Loading } from '../common/Loading';
import { FlatGrid } from 'react-native-super-grid';
import { Actions } from 'react-native-router-flux';

class Menu extends PureComponent {

  constructor(props) {
    super(props);
    
    // let unitID = 'ca-app-pub-5048098651344514/1247820419';
    // if (isAndroid) unitID = 'ca-app-pub-5048098651344514/3013393881';
    // AdMobInterstitial.setAdUnitID(unitID);
    // AdMobInterstitial.setTestDevices([AdMobInterstitial.simulatorId]);

    this.first = getFirstLaunch();
    this.state = {
      loading: this.first,
      main: DATA[LOCAL.userInfo]
    };

    this.getData();

    if (this.first) {
      // Update data here if it is not first launch
      let dn = new Downloader(getCurrServer());
      dn.updateAll(true).then(obj => {
        // Make sure it finishes downloading
        if (obj.status) {
          this.setState({loading: false});
          setFirstLaunch(false);
        } else {
          // Reset to a special page
          // For now, just an error message
          Alert.alert(lang.error_title, lang.error_download_issue + '\n\n' + obj.log);
        }
      });
    } else {
      // Valid pro version
      // validateProVersion().then(() => {
      //   this.setState({loading: false});
      // }).catch();
    }
  }

  componentDidUpdate() {
    this.getData();
    const { main } = this.state;
    let curr = DATA[LOCAL.userInfo];
    setLastLocation('');
    if (curr.account_id !== main.account_id) {
      this.setState({main: curr});
    }
  }

  componentDidMount() {
    if (!this.first) {
      if (LASTLOCATION !== '') {
        let extra = {};
        if (LASTLOCATION === 'Statistics') {
          // No main account (it will trigger bug statistics screen)
          if (DATA[LOCAL.userInfo].account_id == '') LASTLOCATION = '';
          else extra = {info: this.state.main};
        }
        else if (LASTLOCATION === 'Upgrade') {
          LASTLOCATION = 'Consumable';
          extra = {upgrade: true};
        }
        setTimeout(() => SafeAction(LASTLOCATION, extra));
      }
    }

    if (DATA[LOCAL.showFullscreen]) {
      AdMobInterstitial.requestAd().then(() => AdMobInterstitial.showAd());
    }
  }

  getData() {
    // Data for the list
    this.wiki = [{t: lang.wiki_achievement, i: require('../../img/Achievement.png'), p: () => SafeAction('Achievement')},
    {t: lang.wiki_warships, i: require('../../img/Warship.png'), p: () => SafeAction('Warship')},
    {t: lang.wiki_upgrades, i: require('../../img/Upgrade.png'), p: () => SafeAction('Consumable', {upgrade: true})},
    {t: lang.wiki_flags, i: require('../../img/Camouflage.png'), p: () => SafeAction('Consumable')},
    {t: lang.wiki_skills, i: require('../../img/CommanderSkill.png'), p: () => SafeAction('CommanderSkill')},
    {t: lang.wiki_maps, i: 'map', p: () => SafeAction('Map')},
    {t: lang.wiki_collections, i: require('../../img/Collection.png'), p: () => SafeAction('Collection')}];

    const domain = getCurrDomain();
    this.prefix = getCurrPrefix();

    
    this.offical_websites = [
      {t: lang.website_official_site, d: `https://worldofwarships.${domain}/`},
      {t: lang.website_premium, d: `https://${this.prefix}.wargaming.net/shop/wows/`},
      {t: lang.website_global_wiki, d: `http://wiki.wargaming.net/en/World_of_Warships/`},
      {t: lang.website_dev_blog, d: `https://www.facebook.com/wowsdevblog/`},
    ];
    
    // TODO: change links base on player server
    this.stats_info_website = [
      {t: lang.website_sea_group, d: `https://sea-group.org/`},
      {t: lang.website_daily_bounce, d: `https://thedailybounce.net/category/world-of-warships/`},
      {t: lang.website_numbers, d: `https://${this.prefix}.wows-numbers.com/`},
      {t: lang.website_models, d: `https://sketchfab.com/tags/world-of-warships`},
      {t: '', d: 'https://gamemodels3d.com/games/worldofwarships/'},
    ];
    
    this.ultility_websites = [
      {t: '', d: 'https://mustanghx.github.io/ship_ap_calculator/'},
      {t: '', d: 'https://wowsft.com/'},
    ]
    
    this.ingame_websites = [
      {t: '', d: `https://${this.prefix}.wargaming.net/id/signin/`},
      {t: '', d: `https://worldofwarships.${domain}/userbonus/`},
      {t: '', d: `https://worldofwarships.${domain}/news_ingame/`},
      {t: '', d: `https://armory.worldofwarships.${domain}/`},
      {t: '', d: `https://shop.worldofwarships.${domain}/`},
      {t: '', d: `https://clans.worldofwarships.${domain}/clans/gateway/wows/profile/`},
      {t: '', d: `https://warehouse.worldofwarships.${domain}/`},
      {t: '', d: `https://logbook.worldofwarships.${domain}/`},
    ];
      
    this.youtubers = [
      {t: lang.youtuber_official, d: 'https://www.youtube.com/user/worldofwarshipsCOM'},
      {t: lang.youtuber_flambass, d: 'https://www.youtube.com/user/Flambass'},
      {t: lang.youtuber_flamu, d: 'https://www.youtube.com/user/cheesec4t'},
      {t: lang.youtuber_iChaseGaming, d: 'https://www.youtube.com/user/ichasegaming'},
      {t: lang.youtuber_jingles, d: 'https://www.youtube.com/user/BohemianEagle'},
      {t: lang.youtuber_notser, d: 'https://www.youtube.com/user/MrNotser'},
      {t: lang.youtuber_NoZoupForYou, d: 'https://www.youtube.com/user/ZoupGaming'},
      {t: lang.youtuber_panzerknacker, d: 'https://www.youtube.com/user/pzkpasch'},
      {t: lang.youtuber_Toptier, d: 'https://www.youtube.com/channel/UCXOZ2gv_ZGomWNcQU8BBfdQ'},
      {t: lang.youtuber_yuro, d: 'https://www.youtube.com/user/spzjess'},
    ];
  }

  render() {
    const { loading, main } = this.state;
    if (loading) return <Loading />
    
    // For main account
    let enabled = main.account_id !== '';
    let title = `- ${main.nickname} -`;
    if (title === '-  -') title = '- ??? -';
    
    return (
      <WoWsInfo noRight title={title} onPress={enabled ? () => SafeAction('Statistics', {info: main}) : null} home upper={false}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always'>
          <Animatable.View ref='AppName' animation='fadeInDown' easing='ease'>
            <AppName />
          </Animatable.View>
          { this.renderProButton() }
          <Animatable.View animation='fadeInUp' delay={200} easing='ease'>
            { this.renderContent() }
          </Animatable.View>
        </ScrollView>
        <FAB icon='magnify' style={styles.fab} onPress={() => SafeAction('Search')}/>
      </WoWsInfo>
    );
  }

  renderProButton() {
    if (isProVersion()) return null;
    return (
      <Button mode='contained' theme={{roundness: 0}} style={{marginTop: 8}} onPress={() => Actions.ProVersion()}>
        {lang.pro_upgrade_button}
      </Button>
    );
  }

  renderContent() {
    const { icon } = styles;
    return (
      <View>
        <SectionTitle title={lang.wiki_section_title}/>
        <FlatGrid items={this.wiki} itemDimension={300} renderItem={({item}) => {
          return <List.Item title={item.t} style={{padding: 0, paddingLeft: 8}} onPress={() => item.p()}
          left={() => <List.Icon style={[icon, ThemeBackColour()]} color={TintColour()[300]} icon={item.i}/>}
          right={() => isAndroid ? null : <List.Icon color={Colors.grey500} icon='chevron-right'/>} />
        }} spacing={0}/>
        <SectionTitle title={lang.extra_section_title}/>
        <List.Item title='RS Beta' description={lang.extra_rs_beta} 
          onPress={() => onlyProVersion() ? SafeAction('RS') : null}/>
        <SectionTitle title={lang.website_title}/>
        <List.Accordion title={lang.website_title} >
          <FlatGrid items={this.offical_websites} itemDimension={300} renderItem={({item}) => {
            return <List.Item title={item.t} description={item.d}
            onPress={() => Linking.openURL(item.d)}/>
          }} spacing={0}/>
        </List.Accordion>
        <List.Accordion title={lang.website_title} >
          <FlatGrid items={this.stats_info_website} itemDimension={300} renderItem={({item}) => {
            return <List.Item title={item.t} description={item.d}
            onPress={() => Linking.openURL(item.d)}/>
          }} spacing={0}/>
        </List.Accordion>
        <List.Accordion title={lang.website_title} >
          <FlatGrid items={this.ultility_websites} itemDimension={300} renderItem={({item}) => {
            return <List.Item title={item.t} description={item.d}
            onPress={() => Linking.openURL(item.d)}/>
          }} spacing={0}/>
        </List.Accordion>
        <List.Accordion title={lang.youtuber_title}>
          <FlatGrid items={this.youtubers} itemDimension={300} renderItem={({item}) => {
            return <List.Item title={item.t} description={item.d}
            onPress={() => Linking.openURL(item.d)}/>
          }} spacing={0}/>
        </List.Accordion>
        <List.Accordion title={lang.youtuber_title} expanded>
          <FlatGrid items={this.ingame_websites} itemDimension={300} renderItem={({item}) => {
            return <List.Item title={item.t} description={item.d}
            onPress={() => Linking.openURL(item.d)}/>
          }} spacing={0}/>
        </List.Accordion>
        {/* <List.Section title={lang.tool_title}>
        </List.Section> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon: {
    borderRadius: 100
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  }
});

export { Menu };
