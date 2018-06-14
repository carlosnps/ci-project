<?php


namespace Drupal\ysm_global_network_core\Plugin\views\filter;

use Drupal\Core\Form\FormStateInterface;
use Drupal\views\Plugin\views\display\DisplayPluginBase;
use Drupal\views\Plugin\views\filter\InOperator;
use Drupal\views\ViewExecutable;
use Drupal\Core\Database\Query\Condition;

/**
 * Filters and sorts events by upcoming / previous.
 *
 * @ingroup views_filter_handlers
 *
 * @ViewsFilter("ysm_gn_event_upcoming")
 */
class YsmGnEventDate extends InOperator {
	
	/**
	 * {@inheritdoc}
	 */
	public function init(ViewExecutable $view, DisplayPluginBase $display, array &$options = NULL) {
		parent::init($view, $display, $options);

		$this->valueTitle = t('GN Upcoming Events ');
		
		$this->alwaysMultiple = false; // Do not lock this filter as being multi value
    $this->no_operator = true; // Disable the use of operators in this filter - Not working ?!?
    $this->always_required = false; // Lock as always required
		
		// Register a callback to modify the available options
//		$this->definition['options callback'] = array($this, 'generateOptions');
		
		$this->valueOptions = [
			'upcoming' => 'Upcoming',
			'previous' => 'Previous',
		];
	
	}

	/**
	 * Set some of our default filter options
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

		/* SQL to order by date across columns, keeping for reference
			SELECT
			  n.nid, d.field_date_value, cd.field_course_dates_value,
			  GREATEST(
			      COALESCE(d.field_date_value, 0),
			      COALESCE(cd.field_course_dates_value, 0)
			  ) as overall
			  FROM node n
			LEFT OUTER JOIN field_event_dates d ON d.entity_id = n.nid
			LEFT OUTER JOIN node__field_course_dates cd ON cd.entity_id = n.nid
			WHERE n.nid IN (75, 76, 77, 80, 82, 35654, 44286, 44287, 44288, 44297)
			  AND (
	        (field_date_value IS NULL OR field_date_value > NOW())
	        OR
	        (field_course_dates_value IS NULL OR field_course_dates_value > NOW())
	      )
			ORDER BY overall DESC;
		 */
		
		if (!empty($this->value)) {
			
			$definition = [
				'type' => 'LEFT OUTER',
				'table' => 'node__field_event_dates',
				'field' => 'entity_id',
				'left_table' => 'node_field_data',
				'left_field' => 'nid',
			];
			$join = \Drupal::service('plugin.manager.views.join')->createInstance( 'standard', $definition );
			$event_date_alias = $this->query->addRelationship( 'ysm_event_date', $join, $this->table );
			
			$definition = [
				'type' => 'LEFT OUTER',
				'table' => 'node__field_course_dates',
				'field' => 'entity_id',
				'left_table' => 'node_field_data',
				'left_field' => 'nid',
			];
			$join = \Drupal::service('plugin.manager.views.join')->createInstance( 'standard', $definition );
			$course_date_alias = $this->query->addRelationship( 'ysm_course_date', $join, $this->table );
			
			$definition = [
				'type' => 'LEFT OUTER',
				'table' => 'node__field_start_date',
				'field' => 'entity_id',
				'left_table' => 'node_field_data',
				'left_field' => 'nid',
			];
			$join = \Drupal::service('plugin.manager.views.join')->createInstance( 'standard', $definition );
			$start_date_alias = $this->query->addRelationship( 'ysm_course_date', $join, $this->table );
			
			$definition = [
				'type' => 'LEFT OUTER',
				'table' => 'node__field_end_date',
				'field' => 'entity_id',
				'left_table' => 'node_field_data',
				'left_field' => 'nid',
			];
			$join = \Drupal::service('plugin.manager.views.join')->createInstance( 'standard', $definition );
			$end_date_alias = $this->query->addRelationship( 'ysm_course_date', $join, $this->table );
			
			$datejoin = "GREATEST( "
			            ."COALESCE($event_date_alias.field_event_dates_value, 0), "
			            ."COALESCE($course_date_alias.field_course_dates_value, 0), "
			            ."COALESCE($start_date_alias.field_start_date_value, 0)"
									.")";
			$datejoin_alias = $this->query->addField( NULL, $datejoin, 'ysm_query_date' );
			
			$enddatejoin = "GREATEST( "
			               ."COALESCE($event_date_alias.field_event_dates_end_value, 0), "
			               ."COALESCE($course_date_alias.field_course_dates_end_value, 0), "
			               ."COALESCE($end_date_alias.field_end_date_value, 0) "
			               .")";
			$end_datejoin_alias = $this->query->addField( NULL, $enddatejoin, 'ysm_query_enddate' );
			
			$value = reset($this->value );
			if( $value === 'previous' ) {
				$this->query->addOrderBy(NULL, NULL, 'DESC', $datejoin_alias);
				
				$eventCondition = new Condition('AND');
				$eventCondition->condition("$event_date_alias.field_event_dates_end_value", null, 'IS NOT NULL');
				$eventCondition->where("$event_date_alias.field_event_dates_end_value < NOW()", []);
				
				$courseCondition = new Condition('AND');
				$courseCondition->condition("$course_date_alias.field_course_dates_end_value", null, 'IS NOT NULL');
				$courseCondition->where("$course_date_alias.field_course_dates_end_value < NOW()", []); // NB! Filter by end value
				
				$dateCondition = new Condition('AND');
				$dateCondition->condition("$end_date_alias.field_end_date_value", null, 'IS NOT NULL');
				$dateCondition->where("$end_date_alias.field_end_date_value < NOW()", []); // NB! Filter by end value
				
				$condition = new Condition('OR');
				$condition->condition($eventCondition);
				$condition->condition($courseCondition);
				$condition->condition($dateCondition);
				
				$this->query->addWhere($this->options['group'], $condition);

			}
			else {
				$this->query->addOrderBy(NULL, NULL, 'ASC', $datejoin_alias);
				
				$eventCondition = new Condition('AND');
				$eventCondition->condition("$course_date_alias.field_course_dates_value", null, 'IS NULL');
				$eventCondition->where("$event_date_alias.field_event_dates_end_value > NOW()", []);
				
				$courseCondition = new Condition('AND');
				$courseCondition->condition("$event_date_alias.field_event_dates_value", null, 'IS NULL');
				$courseCondition->where("$course_date_alias.field_course_dates_end_value > NOW()", []);// NB! Filter by end value
				
				$dateCondition = new Condition('AND');
				$dateCondition->condition("$start_date_alias.field_start_date_value", null, 'IS NOT NULL');
				$dateCondition->where("$start_date_alias.field_start_date_value > NOW()", []); // NB! Filter by end value
				
				$condition = new Condition('OR');
				$condition->condition($eventCondition);
				$condition->condition($courseCondition);
				$condition->condition($dateCondition);
				
				$this->query->addWhere($this->options['group'], $condition);
				
			}
			
		}
	}
}