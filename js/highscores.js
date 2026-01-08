$(document).ready(function () {
    get_scores();
});


function get_scores() {

    let r_data = { 'cmd': "get_scores" };

    $.ajax({
        url: "api/asteroid_dba.php",
        type: "post",
        data: r_data,
        success: (res) => {
            const data = JSON.parse(res);
            create_table_view(data);
            setTimeout(() => { get_scores(); }, 1000);
        }
    })


}




function create_table_view(data) {

    let tbl = document.getElementById("scoreboard");
    tbl.innerHTML = "";


    let h = document.createElement("thead");
    let thr = document.createElement("th");
    h.appendChild(thr);
    for (let k in data[0]) {
        let th = document.createElement("th");
        th.innerText = k.toUpperCase();
        h.appendChild(th);
    }
    tbl.appendChild(h);


    let b = document.createElement("tbody");

    for (let i = 0; i < data.length; i++) {
        let tr = document.createElement("tr");

        let tdr = document.createElement("td");
        tdr.classList.add("td-custom");
        tdr.innerText = (i + 1);

        if (i < 10) {
            let fa = document.createElement("i");
            fa.classList.add("fas");
            fa.classList.add("fa-trophy");
            fa.classList.add("px-2");

            if (i < 3) {
                fa.classList.add("gold");
            }

            tdr.appendChild(fa);
        }

        tr.appendChild(tdr);

        for (let k in data[i]) {
            let td = document.createElement("td");
            td.classList.add("td-custom");
            td.innerText = data[i][k];
            tr.appendChild(td);
        }
        b.appendChild(tr);
    }

    tbl.appendChild(b);

}
