<?php
/** Enable W3 Total Cache */
 //Added by WP-Cache Manager

/** Enable W3 Total Cache */
 //Added by WP-Cache Manager

/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
 //Added by WP-Cache Manager
//define('WP_CACHE', true); //Added by WP-Cache Manager
define( 'WPCACHEHOME', '/var/www/html/wp_vensera/wp-content/plugins/wp-super-cache/' ); //Added by WP-Cache Manager
define('DB_NAME', 'vensera');

/** MySQL database username */
define('DB_USER', 'vensera');
// define('DB_USER', 'root');

/** MySQL database password */
define('DB_PASSWORD', '15563200025ff0');
// define('DB_PASSWORD', 'root');

/** MySQL hostname */
define('DB_HOST', 'vensera.cisdtmhkjjzs.ap-northeast-1.rds.amazonaws.com');
// define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', 'utf8_general_ci');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'uu@NybIY<H+8Lpw@3~*&m+l*XTfS[qX^q~?Mbo5 zA+cAmJ` x)]Q0X{/`DtBv6C');
define('SECURE_AUTH_KEY',  '!q@?,_nIZ ^*&Z^B}w*qE2}VJ~J.iDGG=|_=K/^:8jb:^7ABIe!b(+<GC31*La:@');
define('LOGGED_IN_KEY',    'j2%c_b=axWr;U54Nuq96Xb%W:fRi{;`K&$s=L4|(>D7JOU,-4&MiuIFZG.48~.Bf');
define('NONCE_KEY',        'SWr.)-I~4`Ml@jMYdVw3aHC~uy^3{vXr]q*M6R^.E4 tsuAf}(A,&rx>Lc:Zx_&t');
define('AUTH_SALT',        'N(vwB`Gvf|3.M4$d;*`C8!,[E_8gu=n@=0a7/N7EH-GYy0],V5`GP)JD>?cJn32n');
define('SECURE_AUTH_SALT', 'CA-4m[_z]=M/PP~*e:|FPKXF}V{+8@q*gA)qy?@h<+WEljG@{ WG}D#8H!&6wKjR');
define('LOGGED_IN_SALT',   '2.7%kxiXL`,a4FN^jz8.1G`/QBuw&nuV~F$Q@B3.U$VU*zY`w/~)m9E]`tcYZ=&w');
define('NONCE_SALT',       '<GR}thA5d|F&:!N=Y?&l?W9y4=A}v`@}y2x/90<Vn.@N@}AXU:7f@@oM.L`N 4Vl');

define( 'DBI_AWS_ACCESS_KEY_ID', 'AKIAJOKB7AXQLSZ4EPTQ' );
define( 'DBI_AWS_SECRET_ACCESS_KEY', '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' );

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');

define('FORCE_SSL_ADMIN', true);
