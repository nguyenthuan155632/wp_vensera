=== Google AdSense ===
Contributors: google
Tags: google
Requires at least: 3.5
Tested up to: 4.5
Stable tag: trunk
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

The official AdSense Plugin, written by Google (DEPRECATED).

== Description ==

This is being deprecated, for more information please see [AdSense Plugin Deprecation](https://support.google.com/adsense/answer/3380626). If you are an existing publisher, your ads will be unaffected but from 5 April you will no longer be able to modify your ad layouts and 3 May you will no longer be able to visit the frontend of the plugin.

== Installation ==

This is being deprecated, please do not install. For more information see [AdSense Plugin Deprecation](https://support.google.com/adsense/answer/3380626)

= Terms of service =

The plugin source code is GPL, however use of Google Services through the plugin is governed by [Google's Terms of Service](http://www.google.com/policies/terms/) and [Privacy Policy](http://www.google.com/policies/privacy/). For products and services that can be used with the AdSense Plugin, such as AdSense, additional Terms of Service may also apply.

= HTML5 Local Storage =

Google uses HTML5 Local Storage in the end-user's browser to record which kind of ad layout it serves to each browser; this includes the number of ads served and their position on the site. This helps Google compare ad performance across different ad layouts. The information is anonymous and is not personally identifiable. Do not use this Google-managed value for your own tracking; it may prevent the plugin from gathering reliable data about ad layouts. Your site should already include the appropriate disclosures about cookie usage, but please ensure that you [make the disclosures required by AdSense terms and conditions](https://support.google.com/adsense/answer/1348695).

== Changelog ==

= 3 May 2017, Plugin version 1.2.1 =
* Support ending for the plugin.

= 5 April 2017, Plugin version 1.2.1 =
* You will no longer be able to place new ads using the plugin.

= 1 March 2017, Plugin version 1.2.1 =
* Plugin deprecation.

= 10 December 2015, Plugin version 1.2.1 =
* Fixed a bug that could blank the AdSense Plugin settings on a read failure.

= 17 August 2015, Plugin version 1.2.0 =
* Improved interaction with caching plugins.
* Added new activation success notification.

= 18 June 2015, Plugin version 1.1.1 =
* You can now use Automated Mobile Ads without having to remove existing ads from your site.
* Fixed a bug that showed an incorrect error when an unauthorized call to an admin-only action is made.
* New AdSense logo.

= 20 Feb 2015, Plugin version 1.1.0 =
* Ads can now be placed on custom page templates.

= 13 Jan 2015, Plugin version 1.0.2 =
* Fixed a bug that caused newly created pages on some themes to be incorrectly recognized as using custom page templates.

= 16 Dec 2014, Plugin version 1.0.1 =
* Fixed two remaining occurrences of the previous plugin name.

= 11 December 2014  =
The following change does not require a plugin update, and was fixed server-side.

* Full roll out of Automated Mobile Ads.

= 8 December 2014, Plugin version 1.0.0 =
Renamed the plugin from "Google Publisher Plugin" to "AdSense Plugin", and moved it out of beta.

= 10 November 2014 =
The following changes do not require a plugin update, and were fixed server-side.

* Link units are no longer recognized as regular ad units by the plugin. This makes it possible to place three ads on a template using the plugin regardless of the number of link units.
* It is now possible to temporarily place more than three ads per template in design mode. The additional ad units must be removed before saving.
* Fixed a bug that made it impossible to remove or modify a placement placed above a paragraph that no longer existed. Posts and pages with a small number of paragraphs will now have additional placeholder paragraphs in design mode.

= 2 October 2014 =
The following changes do not require a plugin update, and were fixed server-side.

* Added more ad placements options between sidebar widgets.
* Fixed a common incompatibility with the "WordPress SEO by Yoast" plugin. This bug made page analysis fail with a "cache error" when the date-based archives were disabled.

= 19 Aug 2014, Plugin version 0.3.0  =
* [Exclude pages](https://support.google.com/adsense/answer/6023216#disable) from having ads on them.
* Support to deliver ad layout updates from Google in order to, for example, fix broken layouts.

The following changes do not require a plugin update, and have been fixed server-side.

* Ad placements are automatically populated for each template for new users.
* [Manually insert ads](https://support.google.com/adsense/answer/6051417?hl=en&ref_topic=3380274) in locations that you determine yourself. This gives you all the power of manually adding ad slots, yet retains the ease of use of the plugin.

= 27 May 2014, Plugin version 0.2.0 =
* A notification will now be shown on the WordPress dashboard when one or more ads are not appearing correctly (for example, because the theme has changed). Note that these notifications are currently only updated once a day.
* Ads will now only be shown on the theme they were placed on. For example, when a separate theme is used for mobile devices, ads will no longer be shown on that theme.
* Fixed an incompatibility with a number of other plugins.
* Extended the nonce lifetime, which should reduce the number of failed saves.

= 1 May 2014 =
The following changes do not require a plugin update, and were fixed server-side.

 * Ad units created by the plugin now have understandable names in AdSense, such as "Front page - 1 (yoursite.com)".
 * Added support for placing ads on "Tags" and "Category" pages.
 * Fixed miscellaneous errors when computing possible placements.
 * Improved error messages for various failures.

= 30 Jan 2014 =
The following changes do not require a plugin update, and were fixed server-side.

* No longer show dynamicgoogletags.update() in post content if the theme incorrectly strips HTML.
* Added support for sites with mixed case URLs.
* Fixed bug related to preview of vertical ads.
* Improved margins on ad placements.
* Inverted marker for placement at the top of the page to point at the correct location for placement.
* Added support for sites that use HTTPS but are administered over HTTP.
* Update the view, specifically ad sizes, when user resizes the window in preview mode.
* Fixed miscellaneous errors when computing possible placements.
* Localized AdSense help center pages for the plugin.

= 15 Jan 2014, Plugin version 0.1.0 =
* Initial release.
