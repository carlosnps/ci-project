<?php
/**
 * @file
 * Contains \Drupal\som_gnam_migrate\Plugin\migrate\source\CasUser.
 */

namespace Drupal\som_gnam_migrate\Plugin\migrate\source;

use Drupal\migrate\Row;
use Drupal\migrate_drupal\Plugin\migrate\source\DrupalSqlBase;

/**
 * Extract cas usernames from Drupal 7 database.
 *
 * @MigrateSource(
 *   id = "gnam_cas_user"
 * )
 */
class CasUser extends DrupalSqlBase {

  /**
   * {@inheritdoc}
   */
  public function query() {
    return $this->select('cas_user', 'cas')
                ->fields('cas', array_keys($this->baseFields()))
                ->condition('uid', 0, '>');
  }

  /**
   * {@inheritdoc}
   */
  public function fields() {
    $fields = $this->baseFields();
    return $fields;
  }

  /**
   * {@inheritdoc}
   */
  public function prepareRow(Row $row) {
    $row->setSourceProperty('provider', 'cas');
    return parent::prepareRow($row);
  }

  /**
   * {@inheritdoc}
   */
  public function getIds() {
    return array(
      'aid' => array(
        'type' => 'integer',
        'alias' => 'cas',
      ),
    );
  }

  /**
   * Returns the user base fields to be migrated.
   *
   * @return array
   *   Associative array having field name as key and description as value.
   */
  protected function baseFields() {
    $fields = [
      'aid' => $this->t('Auth id'),
      'uid' => $this->t('User id'),
      'cas_name' => $this->t('Cas username'),
    ];
    return $fields;
  }

  /**
   * {@inheritdoc}
   */
  public function bundleMigrationRequired() {
    return FALSE;
  }

  /**
   * {@inheritdoc}
   */
//  public function entityTypeId() {
//    return 'user';
//  }

}
?>