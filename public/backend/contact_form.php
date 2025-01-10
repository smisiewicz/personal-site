<?php
// contact_form.php

// Allow cross-origin requests from React frontend (useful during development)
// header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the JSON data sent from React
    $data = json_decode(file_get_contents("php://input"));

    // Extract data from the request
    $email = isset($data->email) ? $data->email : '';
    $subject = isset($data->subject) ? $data->subject : '';
    $message = isset($data->message) ? $data->message : '';

    // Validation: Ensure all fields are provided
    if (empty($email) || empty($subject) || empty($message)) {
        echo json_encode(["error" => "All fields are required."]);
        http_response_code(400); // Bad Request
        exit();
    }

    // Your email details
    $to = "form@misiewicz.info";
    $headers = "From: form@misiewicz.info\r\n";
//     $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    // Send the email
    if (mail($to, $subject, $message, $headers)) {
        echo json_encode(["message" => "Email sent successfully!"]);
    } else {
        echo json_encode(["error" => "Failed to send email. Please try again later."]);
        http_response_code(500); // Internal Server Error
    }
} else {
    echo json_encode(["error" => "Invalid request method."]);
    http_response_code(405); // Method Not Allowed
}
