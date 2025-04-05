<?php
//write received data to the result file
header('Content-Type: text/plain');

// Retrieve the string data from the POST request
$data = $_POST['data'];

// File path
$filePath = 'data/result.csv';

// Open the file in append mode and write the data
if ($file = fopen($filePath, 'a')) {
    // Write the data to the file
    fwrite($file, $data);
    fclose($file);

    echo "String data written to the file successfully.";
} else {
    echo "Error opening the file for writing.";
}
?>