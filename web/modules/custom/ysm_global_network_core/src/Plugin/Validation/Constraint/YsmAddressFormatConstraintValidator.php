<?php

namespace Drupal\ysm_global_network_core\Plugin\Validation\Constraint;

use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use CommerceGuys\Addressing\AddressFormat\AddressFormat;
use CommerceGuys\Addressing\AddressFormat\AddressField;

class YsmAddressFormatConstraintValidator extends \Drupal\address\Plugin\Validation\Constraint\AddressFormatConstraintValidator  implements ContainerInjectionInterface {

  /**
   * We override the original class to exclude locality from being required in
   * form submissions
   * @param array $values
   * @param \CommerceGuys\Addressing\AddressFormat\AddressFormat $addressFormat
   * @param \Symfony\Component\Validator\Constraint $constraint
   */
  protected function validateFields($values, AddressFormat $addressFormat, $constraint)
  {
    // Validate the presence of required fields.
    $requiredFields = $addressFormat->getRequiredFields();

    // This is the part which excludes locality
    if (($key = array_search('locality', $requiredFields)) !== false) {
      unset($requiredFields[$key]);
    }

    foreach ($requiredFields as $field) {
      if (empty($values[$field]) && in_array($field, $constraint->fields)) {
        $this->addViolation($field, $constraint->notBlankMessage, $values[$field], $addressFormat);
      }
    }

    // Validate the absence of unused fields.
    $unusedFields = array_diff(AddressField::getAll(), $addressFormat->getUsedFields());
    foreach ($unusedFields as $field) {
      if (!empty($values[$field]) && in_array($field, $constraint->fields)) {
        $this->addViolation($field, $constraint->blankMessage, $values[$field], $addressFormat);
      }
    }
  }

}