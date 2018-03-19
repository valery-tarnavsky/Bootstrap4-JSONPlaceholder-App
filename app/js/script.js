var toDoList = (function(){
    var todoListTable      = document.querySelector('.todoListTable tbody'),
        row                = todoListTable.getElementsByTagName("tr"),
        inputs             = document.getElementsByTagName("input"),
        btnLoadMore        = document.querySelector(".btn-loadMore"),
        checkAll           = document.querySelector('#checkAll'),
        sorting            = document.querySelector('.sorting'),
        searchInput        = document.querySelector('.searchInput'),
        dropdownSearch     = document.querySelector('.dropdown-search'),
        dropdownHint       = document.querySelector('.search-hint'),
        btnSearch          = document.querySelector('.btn-search'),
        btnShowAll         = document.querySelector('.btn-showAll'),
        messages           = document.querySelector('.messages');

    var allData = [];
    var displayedData = [];
    var checked = [];

    function scrollToBottom(){
        window.scrollTo(0,document.body.scrollHeight);
    }

    function isEnterButton(e){
        var key = e.which || e.keyCode;
        key == 13 && findMatch();
    }

    function validate() {
        return searchInput.value.length < 2;
    }

    function reset(){
        checkAll.checked = false;
        displayedData.length = 0;
        todoListTable.innerHTML = '';
        toggleButtons(false);
        showErrMsg(false);
        loadTable();
    }

    function showErrMsg(status) {
        messages.innerHTML = status ? '<p class="text-center alert alert-light" role="alert""><em>No match found</em></p>' : '';
    }

    function toggleButtons(status){
        if(status){
            btnLoadMore.setAttribute('disabled', 'disabled');
            btnShowAll.classList.remove('hidden');
        }else{
            btnLoadMore.removeAttribute('disabled');
            btnShowAll.classList.add('hidden');
        }
    }

    function prepareStr(str) {
        return str.toLowerCase().replace(/[^\w\s\d]/gi, "").trim();
    }

    function findMatch() {
        var target = prepareStr(searchInput.value),
            findIn = ["userName", 'title'],
            result = [];
         findIn.forEach(function (item){
            result.push(...(allData.filter(function (entry) { return entry[item].match(new RegExp(target, 'gi'))})));
        });
        if(result.length){
            reloadTable(result)
        }else{
            todoListTable.innerHTML = '';
            showErrMsg(true);
        }
        searchInput.value = '';
        toggleButtons(true);
    }

    function copyHintToInput(e) {
        searchInput.value = e.target.innerText;
        console.log(e.target.classList.contains('hint-item'));
        showHintDropdown(false);
    }

    function showHintDropdown(status){
        dropdownSearch.setAttribute('aria-expanded', status);
    }

    function printHint(arr) {
        if(!arr){
            return showHintDropdown(false);
        }
        dropdownHint.innerHTML = '';
        arr.forEach(function(item) {
            dropdownHint.innerHTML += '<a class="dropdown-item hint-item" href="#">'+ item +'</a>';
        });
        showHintDropdown(true);
    }

    function findHint(target) {
        var match = [];
        allData.forEach(function (item) {
            if(item.userName.match(new RegExp(target, 'gi'))){
                match.push(item.userName);
            }
        });
        var unique = ([...new Set(match)]);
        return unique.length && unique;
    }

    function initSearch(e) {
        if(validate()){
            return showHintDropdown(false);
        }
        var target = searchInput.value.toLocaleLowerCase();
        printHint(findHint(target));
    }
    /* search*/
    function checkToggle(e) {
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].type == "checkbox") {
                inputs[i].checked = this.checked;
            }
        }
        getAllChecked(this.checked);
    }

    function getChecked(e) {
        var target = e.target;
        if(target.checked){
            checked.push(target.id)
        }else {
            var index = checked.indexOf(target.id);
            checked.splice(index, 1);
        }
    }

    function getAllChecked(check){
        if(check){
            for (var i = 0; i < inputs.length; i++) {
                inputs[i].checked && checked.push(inputs[i].id);
                }
        }else{
            checked.length = 0
        }
    }

    function checkAfterReload() {
        for (var i = 0; i < inputs.length; i++) {
            for (var j = 0; j < checked.length; j++) {
                if(inputs[i].id == checked[j]){
                    inputs[i].checked = true;
                }
            }
        }
    }

    function reloadTable(arr) {
        todoListTable.innerHTML = '';
        printTable(arr);
        checkAfterReload();
    }

    function sortArr(e){
        var type = e.target.getAttribute("data-toggle");
        var sorted = displayedData.sort(function(a, b){
            var nameA = a.userName.toLowerCase(),
                nameB = b.userName.toLowerCase();
            return type == "asc" ? (nameA < nameB ? -1 : 1) : (nameA > nameB ? -1 : 1); // refactor!
        });
        reloadTable(sorted);
    }

    function initListener() {
        checkAll.addEventListener('change', checkToggle);
        todoListTable.addEventListener( 'click', getChecked);
        btnLoadMore.addEventListener('click', function() {
            loadTable();
            scrollToBottom();
        });
        sorting.addEventListener('click', sortArr);
        searchInput.addEventListener("keyup", initSearch);
        searchInput.addEventListener("keypress", isEnterButton);
        dropdownHint.addEventListener('click', copyHintToInput);
        btnSearch.addEventListener('click', findMatch);
        document.addEventListener('click', function(){showHintDropdown(false)});
        btnShowAll.addEventListener('click', reset);
    }

    function insertToTmp(obj) {
        var count = row.length + 1;
        return  '<tr class="fade-in">' +
                    '<th scope="row"><input type="checkbox" id="' + obj.id +'"></th>' +
                    '<td>' + count +'</td>' +
                    '<td>' + obj.userName +'</td>' +
                    '<td>' + obj.title +'</td>' +
                    '<td class="complete"><i class="fas fa-' + obj.completed +'"></i></td>' +
                '</tr>';
    }

    function printTable(data) {
        data.forEach(function (item) {
            todoListTable.insertAdjacentHTML('beforeend', insertToTmp(item));
        });
    }

    function loadTable(){
        var showRows = 10,
            current = displayedData.length ? displayedData.length : 0,
            dataToDisplay = allData.slice(current, current + showRows);
        if(displayedData.length <= allData.length ){
            displayedData.push(...dataToDisplay); //spread
            printTable(dataToDisplay);
        }
    }

    function getUserName(num) {
        var name;
        switch (num){
            case 1:
                name = "Jon Snow";
                break;
            case 2:
                name = 'Darth Vader';
                break;
            case 3:
                name = 'Jesse Pinkman';
                break;
            case 4:
                name = 'Luke Skywalker';
                break;
            case 5:
                name = 'Ned Stark';
                break;
            case 6:
                name = 'Obi-Wan Kenobi';
                break;
            case 7:
                name = 'Ramsay Bolton';
                break;
            case 8:
                name = 'Daenerys Targaryen';
                break;
            case 9:
                name = 'Joffrey Baratheon';
                break;
            case 10:
                name = 'Jorah Mormont';
                break;
            default:
                name = "noname"
        }
        return name
    }

    function getIcon(item){
        return item ? "check" : "minus"
    }

    function modifyArr(arr){
        return arr.map(function(item) {
            return {
                id        : item.id,
                userName  : getUserName(item.userId),
                title     : item.title,
                completed : getIcon(item.completed)
            }
        });
    }

    function getData() {
        return fetch('https://jsonplaceholder.typicode.com/todos');
    }

    return {
        init: function(){
            getData()
                .then(function(response) {
                    return response.json();
                })
                .then(function(arr){
                    var data = modifyArr(arr);
                    allData = data.slice();
                    loadTable();
                    initListener();
                })
                .catch(function() {
                    console.log("error");
                });
        }
    }
})();
toDoList.init();