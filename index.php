<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/style.css">
    
    <title>Route Calculator</title>
</head>
<body>

    <form id="form" method="POST">
        <input type="text" name="start" id="" placeholder="Your address"/>
        <button type="submit">Submit</button>
    </form>

    <?php
        var_dump($_POST);
    ?>

    <script src="node_modules/geo-distance/lib/geo-distance.js"></script>
    <script type="text/javascript" src="js/script.js"></script>
</body>
</html>