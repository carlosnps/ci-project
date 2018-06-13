<?php

namespace Drupal\ysm_global_network_core\TwigExtension;


/**
 * A Twig extension that adds a custom function
 */
class YsmTwigExtension extends \Twig_Extension {

  /**
   * Generates a list of all Twig functions that this extension defines.
   *
   * @return array
   *   A key/value array that defines custom Twig functions. The key denotes the
   *   function name used in the tag, e.g.:
   *   @code
   *   {{ testfunc() }}
   *   @endcode
   *
   *   The value is a standard PHP callback that defines what the function does.
   */
  public function getFunctions() {
    return array(
      'ysm_menu' => new \Twig_Function_Function(array(
        'Drupal\\ysm_global_network_core\\TwigExtension\\YsmTwigExtension',
        'ysmMenu',
      )),
    );
  }

  /**
   * Gets a unique identifier for this Twig extension.
   *
   * @return string
   *   A unique identifier for this Twig extension.
   */
  public function getName() {
    return 'ysm_global_network_core.ysm_twig_extension';
  }

  /**
   * Generates a menu. The menu will be calculated based on active trail on the
   * current node id (unless another nid is specified). You can use the plugin
   * in a twig template using the form:
   * {{ ysm_menu('main', 1, true) }}
   *
   * @param string $menu_name Machine name of the menu to display
   *
   * @param integer $level (Optional) Level from which the root is calculated
   *    (default to 1)
   * @param integer $exclude_root (Optional) Exclude the root link from the menu
   *    (defaults to false)
   * @param integer $max_depth (Optional) Set a maximum depth
   *    (defaults to no maximum)
   * @param integer $nid (Optional) $nid from which to calculate the active trail
   *
   * @return string
   *   The generated string.
   *
   * @see \Drupal\system\Tests\Theme\TwigExtensionTest::testTwigExtensionFunction()
   */
  public static function ysmMenu( $menu_name, $level=1, $exclude_root=false, $max_depth=null, $nid=0 ) {

    if( !$nid ) {
      $node = \Drupal::routeMatch()->getParameter('node');
      if ($node instanceof \Drupal\node\NodeInterface) {
        // You can get nid and anything else you need from the node object.
        $nid = $node->id();
      }
    }

    // Get menu tree class
    $menu_tree = \Drupal::menuTree();
    // Get the parameters for the current menu
    $menu_parameters = $menu_tree->getCurrentRouteMenuTreeParameters($menu_name);
    // Get the active trail
    $active_trail = array_reverse(array_keys($menu_parameters->activeTrail));
    // Get the root from the active trail
    if( isset($active_trail[$level]) ) {
      $menu_parameters->setRoot($active_trail[$level]);
    }
    else {
	    $max_depth = 1;
    }

    if( $max_depth ) {
      $menu_parameters->setMaxDepth($max_depth);
    }
    if( $exclude_root ) {
      $menu_parameters->excludeRoot();
    }

    $menu_tree_service = \Drupal::service('menu.link_tree');
    $tree = $menu_tree_service->load($menu_name, $menu_parameters);

    // Apply some manipulators (checking the access, sorting).
    $manipulators = [
      ['callable' => 'menu.default_tree_manipulators:checkNodeAccess'],
      ['callable' => 'menu.default_tree_manipulators:checkAccess'],
      ['callable' => 'menu.default_tree_manipulators:generateIndexAndSort'],
    ];
    $tree = $menu_tree_service->transform($tree, $manipulators);
    // And the last step is to actually build the tree.
    $menu = $menu_tree_service->build($tree);
    return render($menu);
  }

}
