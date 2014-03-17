<?php
require_once __DIR__ . '/defines.php';
require_once __DIR__ . '/libraries/import.php';

require_once(JPATH_ADMINISTRATOR . DIRECTORY_SEPARATOR . 'components' . DIRECTORY_SEPARATOR . 'com_jfusion' . DIRECTORY_SEPARATOR . 'models' . DIRECTORY_SEPARATOR . 'model.jfusion.php');



JFusionFactory::$config = JFactory::getConfig();
JFusionFactory::$language = JFactory::getLanguage();
JFusionFactory::$database = JFactory::getDbo();
JFusionFactory::$document = JFactory::getDocument();
JFusionFactory::$application = JFactory::getApplication();

