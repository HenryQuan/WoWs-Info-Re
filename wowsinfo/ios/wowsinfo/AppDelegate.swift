//
//  AppDelegate.swift
//  wowsinfo
//
//  Created by Yiheng Quan on 14/7/21.
//

import UIKit
import React
import FlipperKit

@main
class AppDelegate: UIResponder, UIApplicationDelegate, RCTBridgeDelegate {

    // This is required or bottomSafeViewHeight from React-CoreModules/RCTRedBox.mm will complain
    var window: UIWindow?
    
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        #if DEBUG
        setupFlipper()
        #endif

        RNHandler.shared.setup(with: self, and: launchOptions)
        setup3DTouchItems()
        return true
    }
    
    private func setup3DTouchItems() {
        UIApplication.shared.shortcutItems = [
            UIApplicationShortcutItem(
                type: "search", localizedTitle: "Search",
                localizedSubtitle: nil,
                icon: .init(type: .search), userInfo: nil),
            UIApplicationShortcutItem(
                type: "warships", localizedTitle: "Warships",
                localizedSubtitle: nil,
                icon: .init(type: .bookmark), userInfo: nil),
        ]
    }
    
    private func setupFlipper() {
        #if FB_SONARKIT_ENABLED
        let client = FlipperClient.shared()
        let layoutDescriptorMapper = SKDescriptorMapper(defaults: ())
        client?.add(FlipperKitLayoutPlugin(rootNode: application, with: layoutDescriptorMapper))
        client?.add(FKUserDefaultsPlugin(suiteName: nil))
        client?.add(FlipperKitReactPlugin())
        client?.add(FlipperKitNetworkPlugin(networkAdapter: SKIOSNetworkAdapter()))
        client?.start()
        #endif
    }
    
    func sourceURL(for bridge: RCTBridge!) -> URL! {
        RNHandler.shared.jsBundleURL
    }
}
