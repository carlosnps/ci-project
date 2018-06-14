<?php

namespace Drupal\ysm_global_network_core\Plugin\Block;

use Drupal\book\Plugin\Block\BookNavigationBlock;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\node\NodeInterface;

/**
 * Provides a 'BookMenu' block.
 *
 * @Block(
 *  id = "book_menu",
 *  admin_label = @Translation("YSM Book menu"),
 *  category = @Translation("YSM")
 * )
 */
class BookMenu extends BookNavigationBlock implements ContainerFactoryPluginInterface {

  public function blockForm($form, FormStateInterface $form_state) {
    return $form;
  }

    /**
   * {@inheritdoc}
   */
  public function build() {
    $current_bid = 0;

    if ($node = $this->requestStack->getCurrentRequest()->get('node')) {
      $current_bid = empty($node->book['bid']) ? 0 : $node->book['bid'];
    }
    if ($current_bid) {

      // Only display this block when the user is browsing a book and do
      // not show unpublished books.
      $nid = \Drupal::entityQuery('node')
                    ->condition('nid', $node->book['bid'], '=')
                    ->condition('status', NodeInterface::PUBLISHED)
                    ->execute();

      // Only show the block if the user has view access for the top-level node.
      if ($nid) {
	     
        $tree = $this->bookManager->bookTreeAllData($node->book['bid'], $node->book, 2);
//        $tree = $this->bookManager->getTableOfContents($node->book['bid'], 1);

        // Build a new tree with the root's children on the same menu level
        $root_key = array_keys($tree)[0];
        $tree[$root_key]['link']['title'] = 'Overview';
        $tree += $tree[$root_key]['below'];
        $tree[$root_key]['below'] = [];

        // Build the tree output
        $output = $this->bookManager->bookTreeOutput($tree);

        // Compare the current path to the path of the book root
        // Identify the root link
        // If root link is not the current page, we remove the active trail
        $current_path = trim( \Drupal::service('path.current')->getPath(), '/');

        $keys = array_keys($output['#items']);
        $root_key = reset($keys);
        $root_link =& $output['#items'][$root_key];
        $root_link['is_root'] = true;

        /** @var  $root_url \Drupal\Core\Url */
        $root_url = $root_link['url'];
        $root_path = $root_url->getInternalPath();
        if( $root_path != $current_path ) {
          $root_link['in_active_trail'] = false;
        }

        if (!empty($output)) {
          return $output;
        }
      }
    }
    return [];
  }

}
