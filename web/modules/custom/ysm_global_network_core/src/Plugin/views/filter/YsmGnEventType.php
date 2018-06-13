<?php
	
	
	namespace Drupal\ysm_global_network_core\Plugin\views\filter;
	
	use Drupal\views\Plugin\views\display\DisplayPluginBase;
	use Drupal\views\Plugin\views\filter\InOperator;
	use Drupal\views\ViewExecutable;
	use Drupal\Core\Database\Query\Condition;
	
	/**
	 * Filters and sorts events by upcoming / previous.
	 *
	 * @ingroup views_filter_handlers
	 *
	 * @ViewsFilter("ysm_gn_event_type")
	 */
	class YsmGnEventType extends InOperator {
		
		/**
		 * {@inheritdoc}
		 */
		public function init( ViewExecutable $view, DisplayPluginBase $display, array &$options = NULL ) {
			parent::init( $view, $display, $options );
			
			$this->valueTitle = t( 'GN Event Type' );
			
			$this->alwaysMultiple = FALSE; // Do not lock this filter as being multi value
			//			$this->no_operator = true; // Disable the use of operators in this filter - Not working ?!?
			//			$this->always_required = false; // Lock as always required
			
			// Register a callback to modify the available options
			$this->definition['options callback'] = [ $this, 'generateOptions' ];
			
		}
		
		/**
		 * Define our options here.
		 *
		 * @return array
		 */
		public function generateOptions() {
			
			$vid             = 'course_types';
			$taxonomyManager = \Drupal::service( 'entity_type.manager' )
			                          ->getStorage( "taxonomy_term" );
			
			$course_terms = $taxonomyManager->loadTree( 'course_types', $parent = 0, $max_depth = NULL, $load_entities = TRUE );
			$event_terms = $taxonomyManager->loadTree( 'event_type', $parent = 0, $max_depth = NULL, $load_entities = TRUE );
			
			$options = [];
			foreach ( $course_terms as $term ) {
				$options[ $term->id() ] = $term->label();
			}
			
			foreach ( $event_terms as $term ) {
				$options[ $term->id() ] = $term->label();
			}
			
			return $options;
		}
		
		/**
		 * Set some of our default filter options
		 *
		 * @return array
		 */
		protected function defineOptions() {
			$options = parent::defineOptions();
			
			// As NULL is not a valid value, we have to set a default
			//		$options['value']['default']    = ['upcoming'];
			
			return $options;
		}
		
		/**
		 * Override the query so that no filtering takes place if the user doesn't
		 * select any options.
		 */
		public function query() {
			
			if ( !empty( $this->value ) ) {
				
				$value = reset( $this->value );
				// If numeric, we know this is a taxonomy value
				if ( is_numeric( $value ) ) {
					
					$definition        = [
						'table'      => 'node__field_course_type',
						'field'      => 'entity_id',
						'left_table' => 'node_field_data',
						'left_field' => 'nid',
					];
					$join              = \Drupal::service( 'plugin.manager.views.join' )
					                            ->createInstance( 'standard', $definition );
					$course_type_alias = $this->query->addRelationship( 'ysm_course_type', $join, $this->table );
					
					$definition       = [
						'table'      => 'node__field_event_type',
						'field'      => 'entity_id',
						'left_table' => 'node_field_data',
						'left_field' => 'nid',
					];
					$join             = \Drupal::service( 'plugin.manager.views.join' )
					                           ->createInstance( 'standard', $definition );
					$event_type_alias = $this->query->addRelationship( 'ysm_event_type', $join, $this->table );
					
					$or = new Condition( 'OR' );
					$or->condition( $event_type_alias . '.field_event_type_target_id', intval( $value ), '=' );
					$or->condition( $course_type_alias . '.field_course_type_target_id', intval( $value ), '=' );
					
					$this->query->addWhere($this->options['group'], $or);
					
				}
				
			}
		}
	}