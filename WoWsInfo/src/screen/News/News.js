import React, { Component } from 'react'
import { Text, FlatList, DrawerLayoutAndroid, SafeAreaView } from 'react-native';
import { WoWsLoading, NewsCell } from '../../component';
import { NewsParser } from '../../core';
import { View } from 'react-native-animatable';
import Drawer from '../Drawer';
import language from '../../constant/language';
import { navStyle } from '../../constant/colour';
import { iconsMap } from '../../constant/icon';
import { LocalData } from '../../constant/value';

export default class News extends Component {
  state = {
    isReady: false,
    data: [],
    isRefreshing: false,
    server: server
  }

  onNavigatorEvent(event) {
    if (event.type == 'NavBarButtonPress') {
      if (event.id == 'drawer') {
        this.props.navigator.toggleDrawer({
          side: 'left',
          animated: true
        });
      } else if (event.id == 'search') {
        this.props.navigator.push({
          title: language.search_title,
          screen: 'info.search',
          navigatorStyle: navStyle(),
          navigatorButtons: {rightButtons: [{icon: iconsMap['undo'], id: 'reset'}]}
        })
      } else if (event.id == 'more') {
        this.props.navigator.showModal({
          title: language.more_header,
          screen: 'news.more',
          navigatorStyle: navStyle(),
          navigatorButtons: {rightButtons: [{title: language.web_done_btn, id: 'done'}]}
        })
      }
    } else if (event.id === 'bottomTabSelected') {
      let store = require('react-native-simple-store');
      store.save(LocalData.saved_tab, 1);
    }
  }

  async componentWillMount() {
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    let store = require('react-native-simple-store');
    store.save(LocalData.saved_tab, 1);
    await this.loadNews();
  }

  newsKey = (item) => {return item.title}        
  render() {
    const { data, isRefreshing, isReady } = this.state;
    if (isReady) {
      return (
        <SafeAreaView>
          <View ref='news'>
            <FlatList data={data} keyExtractor={this.newsKey} onRefresh={() => this.refreshNews()}
            renderItem={({item}) => <NewsCell browser={() => this.pushToBrowser(item)} data={item}/>} refreshing={isRefreshing}/>
          </View>
        </SafeAreaView>
      )
    } else return <WoWsLoading />
  }

  /**
   * Show website in browser
   */
  pushToBrowser(item) {
    console.log(this.state);
    this.props.navigator.push({
      screen: 'info.browser',
      title: language.web_loading,
      passProps: {link: item.link},
      navigatorStyle: navStyle()
    })
  }

  /**
   * Loading news from server
   */
  async loadNews() {
    let news = new NewsParser(server, news_language);
    let data = await news.getNews();
    this.setState({
      isReady: true,
      data: data,
      isRefreshing: false, 
    }, () =>this.refs['news'].bounceInUp(800))
  }

  /**
   * Refreshing news from server (load again)
   */
  async refreshNews() {
    const { isRefreshing, server } = this.state;
    if (server != global.server) {
      console.log(server, global.server)
      // Get news again
      this.setState({ isRefreshing: true, server: global.server })
      await this.loadNews();
    }
  }
}