<?php

namespace Drupal\ysm_global_network_core\Plugin\migrate\destination;


use Drupal\migrate\MigrateException;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\migrate\Plugin\migrate\destination\EntityContentBase;
use Drupal\migrate\Plugin\MigrationInterface;
use Drupal\migrate\Row;

/**
 * Provides node destination, updating only the non-empty fields.
 *
 * @MigrateDestination(
 *   id = "ysm:node_update",
 * )
 */
class YsmNodeUpdate extends EntityContentBase {

  /**
   * Entity type.
   *
   * @var string $entityType
   */
  public static $entityType = 'node';

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition, MigrationInterface $migration = NULL) {

    // NB: EntityContentBase is created using a deriver class based on the node
    // type. So we must call the parent create rather than just extending
    return parent::create($container, $configuration, 'entity:' . static::$entityType, $plugin_definition, $migration);
  }

  /**
   * The standard entity:node plugin only fails where there are no pre-existing
   * migrations with the nid. We make override getEntity to require a
   * pre-existing nid
   *
   * @param \Drupal\migrate\Row $row
   * @param array $old_destination_id_values
   *
   * @return \Drupal\Core\Entity\EntityInterface
   */
  protected function getEntity(Row $row, array $old_destination_id_values) {
    $entity_id = $row->getSourceProperty('nid');
    if (!$entity_id) {
      throw new MigrateException('YsmUpdate : requires nid source property to update node.');
    }
    if (!empty($entity_id) && ($entity = $this->storage->load($entity_id))) {
      // Allow updateEntity() to change the entity.
      return $this->updateEntity($entity, $row) ?: $entity;
    }
    else {
      throw new MigrateException('YsmUpdate : no node entity found. This plugin only updates existing nodes.');
    }

  }
}