<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require 'database.php';

$dominioPermitido = "http://localhost:5173";
header("Access-Control-Allow-Origin: $dominioPermitido");
header("Access-Control-Allow-Headers: content-type");
header("Access-Control-Allow-Methods: OPTIONS,GET,PUT,POST,DELETE");

$db = new DataBase();
$con = $db->conectar();

$directorioDescarga = "descargas/";
$uploadOk = 1;

try{
    if (isset($_FILES["fileInput"]) && !empty($_FILES["fileInput"]["name"])) {
        $targetFile = $directorioDescarga . basename($_FILES["fileInput"]["name"]);
        $fileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));
    
        if ($fileType != "csv") {
            echo "Solo pueden subirse archivos en formato CSV.";
            $uploadOk = 0;
        } else {
            if ($uploadOk == 0) {
                echo 'Fallo en la carga del archivo.';
            } else {
    
                $truncateQuery = "TRUNCATE TABLE productos";
                if ($con->query($truncateQuery)) {
    
                } else {
                    echo ' Error al limpiar la tabla: ' . $con->errorInfo()[2];
                    exit;
                }
    
                $fileName = $_FILES['fileInput']['name'];
                $tempFilePath = $_FILES['fileInput']['tmp_name'];
    
                $targetFilePath = $directorioDescarga . $fileName;
                move_uploaded_file($tempFilePath, $targetFilePath);
    
                $csvFile = fopen($targetFilePath, 'r');
    
                fgetcsv($csvFile);
    
                $sql = $con->prepare(
                    "INSERT INTO productos ( 
                        `Código`,
                        `Producto`,
                        `Categoría`,
                        `Presentación`,
                        `Cantidad x pres.`,
                        `Peso`,
                        `minorista precio x presentación`,
                        `mayorista precio x presentación`,
                        `distribuidor precio x presentación`)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
                );
    
                $lineNumber = 1;

                while (($data = fgetcsv($csvFile, 1000, ";")) !== false) {
                    $lineNumber++;
                    $lineNumber++;
                    
                    // Convertir a UTF-8
                    // $data = array_map('utf8_encode', $data);
                    $data = array_map('trim', $data);
                    $data = array_filter($data, fn($value) => !is_null($value) && $value !== '');

                    if (count($data) === 9) {
                        $sql->execute($data);
                    } else {
                        echo json_encode([
                            "status" => "error",
                            "message" => "\nLa fila $lineNumber no tiene el número correcto de elementos.\nContenido de la fila:\n " . implode(", ", $data) . "\n\nPor favor, revise su archivo de productos, no deve contener casillas vacías. Guarde y vuelvas a cargar el archivo."
                        ]);
                        exit;
                    }
                }

                fclose($csvFile);
                echo json_encode(["status" => "success", "message" => "Archivo CSV cargado exitosamente."]);
            }
        }
    }else {
        echo json_encode(["status" => "error", "message" => "No se ha proporcionado ningún archivo."]);
    }
}catch (PDOException $e) {
    if ($e->getCode() == 'HY093') {
        echo json_encode(["status" => "error", "message" => "Error en la carga: Revise que el archivo CSV tenga las columnas correctas."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error al cargar el archivo CSV: " . $e->getMessage()]);
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}

?>
