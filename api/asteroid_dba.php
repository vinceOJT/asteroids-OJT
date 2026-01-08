
<?php

ini_set('max_input_vars', 50000);
error_reporting(E_ALL);

$db = new MySQLi("localhost", "tetris_app", "Xb0xFriyay!", "asteroid");
$cmd = $_POST['cmd'] ? $_POST['cmd'] : "";
// $_POST['ip'] = $_SERVER['REMOTE_ADDR'] === "::1" ? gethostbyname($hostname) : $_SERVER['REMOTE_ADDR'];
// $_POST['ip'] = $_SERVER['REMOTE_ADDR'] === "::1" ? gethostbyname($hostname) : $_SERVER['REMOTE_ADDR'];
$_POST['ip'] = $_SERVER['REMOTE_ADDR'];



switch ($cmd) {
    case "update_score":
        update_score($_POST);
        break;
    case "get_scores":
        echo json_encode(get_scores());
        break;
    case "check_allow_config":
        echo json_encode(check_allow_config());
        break;
}

function check_allow_config()
{
    global $db;

    $sql = "SELECT sc_on, sc_description FROM system_config WHERE 1 AND sc_id = 1";
    $res = $db->query($sql)->fetch_assoc();
    return $res;
}


function update_score($data)
{
    global $db;
    if (!$data['ip']) {

        return;
    }



    $sql = "SELECT s_id, s_score FROM scores WHERE 1 AND s_ip = '{$data['ip']}'";

    $res = $db->query($sql)->fetch_assoc();

    if (!$res['s_id']) {
        $sql = "INSERT INTO scores (s_ip, s_name, s_data, s_score) VALUES ('{$data['ip']}', '{$data['name']}', '" . json_encode($data) . "', '{$data['score']}')";
        $db->query($sql);
    } else {




        $n_sql = "";

        if ($data['name']) {
            $n_sql = ", s_name = \"{$data['name']}\"";
        }

        if ($res['s_score'] < $data['score']) {
            $sql = "UPDATE scores SET s_data = '" . json_encode($data) . "', s_score = \"{$data['score']}\", x = 1 {$n_sql} WHERE 1 AND s_id = {$res['s_id']}";
        } else {
            $sql = "UPDATE scores SET s_data = '" . json_encode($data) . "', x = 1 {$n_sql} WHERE 1 AND s_id = {$res['s_id']}";
        }
        $db->query($sql);
    }

    echo $sql;
}
function get_scores()
{
    global $db;

    $sql = "SELECT s_name as name, s_score as score FROM scores WHERE 1 AND x = 1 ORDER BY s_score DESC LIMIT 20";
    $rsArray = array();
    $result = $db->query($sql);

    while ($rs = $result->fetch_array(MYSQLI_ASSOC)) {
        array_push($rsArray, $rs);
    }

    return $rsArray;
}





?>












