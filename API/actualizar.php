<?php 	
error_reporting(E_ALL);

require 'database.php';

$db = new DataBase();
$con = $db->conectar();

$dominioPermitido = "http://localhost:5173";
header("Access-Control-Allow-Origin: $dominioPermitido");
header("Access-Control-Allow-Headers: content-type");
header("Access-Control-Allow-Methods: OPTIONS,GET,PUT,POST,DELETE");



if (isset($_GET['action'])) {
    $action = $_GET['action'];
    switch ($action) {
        case 'cred':
            
            $input = json_decode(file_get_contents('php://input'), true);

            if (isset($input['usuario']) && isset($input['clave'])) {
                $nuevoUsuario = $input['usuario'];
                $nuevaClave = $input['clave'];

                $sql = "UPDATE `logcred` SET `usuario`='$nuevoUsuario', `clave`= sha2('$nuevaClave',256) WHERE `id`=1";

                if ($con->query($sql)) {
                    echo json_encode(['success' => true]);
                } else {
                    echo json_encode(['success' => false, 'error']);
                }
            } else {
                echo json_encode(['success' => false, 'error' => 'Invalid input']);
            }

            break;
        case 'amounts':
            case 'amounts':
                $input = json_decode(file_get_contents('php://input'), true);
        
                if (isset($input['updatedAmounts']) && isset($input['updatedAmountsValues'])) {
                    $updatedAmounts = $input['updatedAmounts'];
                    $updatedAmountsValues = $input['updatedAmountsValues'];
        
                    // Actualizar mensajes en la tabla montominimo
                    $nuevoMensajeMinorista = $updatedAmounts['minorista'] ?? $currentValues['minorista'];
                    $nuevoMensajeMayorista = $updatedAmounts['mayorista'] ?? $currentValues['mayorista'];
                    $nuevoMensajeDistribuidor = $updatedAmounts['distribuidor'] ?? $currentValues['distribuidor'];
        
                    $sql2 = "UPDATE `montominimo` SET
                                `mensaje` = CASE
                                WHEN `categoría` = 'minorista' THEN :minorista
                                WHEN `categoría` = 'mayorista' THEN :mayorista
                                WHEN `categoría` = 'distribuidor' THEN :distribuidor
                                ELSE mensaje
                                END";
        
                    $stmt = $con->prepare($sql2);
                    $stmt->bindParam(':minorista', $nuevoMensajeMinorista);
                    $stmt->bindParam(':mayorista', $nuevoMensajeMayorista);
                    $stmt->bindParam(':distribuidor', $nuevoMensajeDistribuidor);
        
                    // Verificar si la consulta de actualización de montominimo se ejecuta correctamente
                    $success1 = $stmt->execute();
        
                    // Actualizar valores en la tabla montos
                    $minoristaMin = $updatedAmountsValues['minoristaMin'] ?? $currentValues['minoristaMin'];
                    $minoristaMax = $updatedAmountsValues['minoristaMax'] ?? $currentValues['minoristaMax'];
                    $mayoristaMin = $updatedAmountsValues['mayoristaMin'] ?? $currentValues['mayoristaMin'];
                    $mayoristaMax = $updatedAmountsValues['mayoristaMax'] ?? $currentValues['mayoristaMax'];
                    $distribuidorMin = $updatedAmountsValues['distribuidorMin'] ?? $currentValues['distribuidorMin'];
                    $distribuidorMax = $updatedAmountsValues['distribuidorMax'] ?? $currentValues['distribuidorMax'];
        
                    $sql3 = "UPDATE `montos` SET
                                `minimo` = CASE
                                WHEN `categoría` = 'minorista' THEN :minoristaMin
                                WHEN `categoría` = 'mayorista' THEN :mayoristaMin
                                WHEN `categoría` = 'distribuidor' THEN :distribuidorMin
                                ELSE minimo
                                END,
                                `maximo` = CASE
                                WHEN `categoría` = 'minorista' THEN :minoristaMax
                                WHEN `categoría` = 'mayorista' THEN :mayoristaMax
                                WHEN `categoría` = 'distribuidor' THEN :distribuidorMax
                                ELSE maximo
                                END";
        
                    $stmt2 = $con->prepare($sql3);
                    $stmt2->bindParam(':minoristaMin', $minoristaMin);
                    $stmt2->bindParam(':minoristaMax', $minoristaMax);
                    $stmt2->bindParam(':mayoristaMin', $mayoristaMin);
                    $stmt2->bindParam(':mayoristaMax', $mayoristaMax);
                    $stmt2->bindParam(':distribuidorMin', $distribuidorMin);
                    $stmt2->bindParam(':distribuidorMax', $distribuidorMax);
        
                    // Verificar si la consulta de actualización de montos se ejecuta correctamente
                    $success2 = $stmt2->execute();
        
                    if ($success1 && $success2) {
                        echo json_encode(['success' => true]);
                    } else {
                        echo json_encode(['success' => false, 'error' => 'Error al actualizar los datos']);
                    }
                } else {
                    echo json_encode(['success' => false, 'error' => 'Invalid input']);
                }
                break;
            default:
                echo json_encode(['success' => false, 'error' => 'Invalid action']);
                break;

            case 'shipments':
                $input = json_decode(file_get_contents('php://input'), true);

                if (isset($_GET['action']) && $_GET['action'] === 'shipments') {
                    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                        try {
                            // Iniciar una transacción
                            $con->beginTransaction();

                            // Limpiar la tabla de envíos actual
                            $con->exec("DELETE FROM entregas");

                            // Preparar la consulta de inserción
                            $stmt = $con->prepare("INSERT INTO entregas (lugar, dia) VALUES (:lugar, :dia)");

                            // Insertar cada envío
                            foreach ($input as $shipment) {
                                $stmt->bindParam(':lugar', $shipment['lugar']);
                                $stmt->bindParam(':dia', $shipment['dia']);
                                $stmt->execute();
                            }

                            // Confirmar la transacción
                            $con->commit();
                            echo json_encode(['success' => true]);
                        } catch (Exception $e) {
                            // Revertir la transacción en caso de error
                            $con->rollBack();
                            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
                        }
                    }
                } else {
                    echo json_encode(['success' => false, 'error' => 'Invalid action']);
                }

    }
    
}

?>