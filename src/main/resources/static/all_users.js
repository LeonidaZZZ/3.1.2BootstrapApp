$(document).ready(function (){
    let tBody = document.getElementById("tBody");
    tBody.innerHTML = "";
    fetch('http://localhost:8080/admin/userList')
        .then(response => response.json())
        .then(users => {
                    users.forEach(function (user) {
                        var row = tBody.insertRow();
                        row.setAttribute("id", user.id);
                        var cell0 = row.insertCell();
                        cell0.innerHTML = user.id;
                        var cell1 = row.insertCell();
                        cell1.innerHTML = user.firstName;
                        var cell2 = row.insertCell();
                        cell2.innerHTML = user.lastName;
                        var cell3 = row.insertCell();
                        cell3.innerHTML = user.age;
                        var cell4 = row.insertCell();
                        cell4.innerHTML = user.email;
                        var cell5 = row.insertCell();
                        cell5.innerHTML = listRoles(user);

                var cell6 = row.insertCell();
                        cell6.innerHTML =
                            '<button id="' + user.id + '" type="button" class="edit btn btn-info" data-toggle="modal">' + 'Edit' + '</button>';

                var cell7 = row.insertCell();
                        cell7.innerHTML =
                            '<button id="' + user.id + '" type="button" class="delete btn btn-danger" data-toggle="modal" >' + 'Delete' + '</button>';
                    })
                });

        })

    fetch('http://localhost:8080/admin/auth')
        .then(response => response.json())
        .then(data => {

            let table = ""
                    if (data.roles.length > 1){
                        var role = data.roles[0].name + ', ' + data.roles[1].name
                    } else {
                        var role = data.roles[0].name
                    }

                    table += ('<tr>')
                    table += ('<td>' + data.id + '</td>')
                    table += ('<td>' + data.firstName + '</td>')
                    table += ('<td>' + data.lastName + '</td>')
                    table += ('<td>' + data.age + '</td>')
                    table += ('<td>' + data.email + '</td>')
                    table += ('<td>' + role + '</td>')

                    table += ('</tr>')


                    $('#auth_user').append(table)
                    $('#admin_header').html(data.firstName + ' with role: ' + role)
        })

    $('#add_button').on('click',function (){

        let $firstName = $('#firstName')
        let $lastname = $('#lastName')
        let $email = $('#email')
        let $age = $('#age')
        let $password = $('#password')

        const data = {
            firstName: $firstName.val(),
            lastName: $lastname.val(),
            email: $email.val(),
            age: $age.val(),
            password: $password.val(),
            roles : roleCreator('#roleSelect')
        }
        console.log(data)

        fetch('http://localhost:8080/admin/save',{
            method: 'POST',
            body: JSON.stringify(data),
            headers:{"Content-type": "application/json; charset=UTF-8"}
        })
            .then(response => response.json())
            .then(user =>{
                $('#all_users_table tr:last').after(
                    '<tr id=' + user.id + '>' +
                    '<td>' + user.id + '</td>' +
                    '<td>' + window.formNewUser.firstName.value + '</td>' +
                    '<td>' + window.formNewUser.lastName.value + '</td>' +
                    '<td>' + window.formNewUser.age.value + '</td>' +
                    '<td>' + window.formNewUser.email.value + '</td>' +
                    '<td>' + listRoles(data) + '</td>' +
                    '<td> <button id="' + user.id + '" type="button" class="edit btn btn-info" data-toggle="modal">' + 'Edit' + '</button> </td>' +
                    '<td> <button id="' + user.id + '" type="button" class="delete btn btn-danger" data-toggle="modal" >' + 'Delete' + '</button> </td>' +
                    '</tr>');
                console.log(data.roles[0].name);
                window.formNewUser.firstName.value = "";
                window.formNewUser.lastName.value = "";
                window.formNewUser.age.value = "";
                window.formNewUser.email.value = "";
                window.formNewUser.password.value = "";
            })
    })

    $(document).delegate('.delete','click',function (){
        var id = $(this).attr('id');
        getModalDelete(id)
        console.log('open delete')

        $(document).delegate('.confirm_delete','click',function (){
                fetch('http://localhost:8080/admin/delete/' + id,{
                    method: 'DELETE',
                    headers:{"Content-type": "application/json; charset=UTF-8"}
                })
                    .then(response =>{
                        $('#' + id).remove()
                    })
        })

    })

    function getModalDelete(id){
        fetch('http://localhost:8080/admin/' + id)
            .then(response => response.json())
            .then(data =>{
                let adminSelect = "";
                let userSelect = "";

            for (let i = 0; i < data.roles.length; i++) {
                if (data.roles[i].id === 2) {
                    adminSelect = "selected";
                }
                if (data.roles[i].id === 1) {
                    userSelect = "selected";
                }
            }

                let modal = document.getElementById('modalWindow')
                modal.innerHTML = '                                           <div class="modal fade" id="ModalDelete" tabindex="-1" role="dialog"\n' +
                    '                                                             aria-hidden="true">\n' +
                    '                                                            <div class="modal-dialog modal-dialog-centered" role="document">\n' +
                    '                                                                <div class="modal-content">\n' +
                    '                                                                    <div class="modal-header">\n' +
                    '                                                                        <h5 class="modal-title" id="Delete_Title">Delete user</h5>\n' +
                    '                                                                        <button class="close" data-dismiss="modal">x</button>\n' +
                    '                                                                    </div>\n' +
                    '                                                                    <div class="modal-body">\n' +
                    '                                                                        <div class="form-group col-6">\n' +
                    '                                                                            <div>\n' +
                    '                                                                        <div class="text-center">\n' +
                    '                                                                            <strong> ID </strong>\n' +
                    '                                                                            <br>\n' +
                    '                                                                            <input  class="form-control" disabled type="text" value="'+data.id+'">\n' +
                    '                                                                            <br>\n' +
                    '                                                                        </div>\n' +
                    '                                                                        <div class="text-center">\n' +
                    '                                                                            <strong> First name</strong>\n' +
                    '                                                                            <br>\n' +
                    '                                                                            <input  class="form-control" disabled type="text" value="'+data.firstName+'">\n' +
                    '                                                                            <br>\n' +
                    '                                                                        </div>\n' +
                    '                                                                        <div class="text-center">\n' +
                    '                                                                            <strong>Last name</strong>\n' +
                    '                                                                            <br>\n' +
                    '                                                                            <input  class="form-control" disabled size="50" type="text" value="'+data.lastName+'">\n' +
                    '                                                                            <br>\n' +
                    '                                                                        </div>\n' +
                    '\n' +
                    '                                                                        <div class="text-center">\n' +
                    '                                                                            <strong>Email</strong>\n' +
                    '                                                                            <br>\n' +
                    '                                                                            <input class="form-control" disabled type="email" value="'+data.email+'">\n' +
                    '                                                                        </div>\n' +
                    '\n' +
                    '                                                                                <div class="text-center">\n' +
                    '                                                                                    <strong>Age</strong>\n' +
                    '                                                                                    <br>\n' +
                    '                                                                                    <input  class="form-control" disabled type="number" value="'+data.age+'">\n' +
                    '                                                                                </div>\n' +
                    '\n' +
                    '                                                                        <div class="text-center">\n' +
                    '                                                                            <br>\n' +
                    '                                                                            <strong>Role</strong>\n' +
                    '                                                                            <div>\n' +
                    '                                                                                <select id="select_delete" size="3" multiple class="form-control" disabled>\n' +
                    '                                                                                    <option id="delete_adminSelect" value="2" '+ adminSelect + '>ADMIN</option>\n' +
                    '                                                                                    <option id="delete_adminSelect" value="1"' + userSelect + '>USER</option>\n' +
                    '                                                                                </select>\n' +
                    '                                                                            </div>\n' +
                    '                                                                        </div>\n' +
                    '                                                                            </div>\n' +
                    '                                                                        </div>\n' +
                    '                                                                    </div>\n' +
                    '                                                                    <div class="modal-footer">\n' +
                    '                                                                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close\n' +
                    '                                                                        </button>\n' +
                    '                                                                        <button type="button" class="confirm_delete btn btn-secondary" data-dismiss="modal" >Delete\n' +
                    '                                                                        </button>\n' +
                    '                                                                    </div>\n' +
                    '                                                                </div>\n' +
                    '                                                            </div>\n' +
                    '                                                        </div>'
                $('#ModalDelete').modal()
            })
    }



    $(document).delegate('.edit','click',function (){
        var id = $(this).attr('id');
        console.log(id);
        getModalEdit(id)
        console.log('open edit')

        $(document).delegate('.confirm_edit','click',function (){

            let $firstName = $('#edit_firstName')
            let $lastname = $('#edit_lastName')
            let $email = $('#edit_email')
            let $age = $('#edit_age')
            let $password = $('#edit_password')

            const data = {
                id: id,
                firstName: $firstName.val(),
                lastName: $lastname.val(),
                email: $email.val(),
                age: $age.val(),
                password: $password.val(),
                roles : roleCreator('#select_edit')
            }
            console.log(data)

            if (confirm('Do you realy want edit')){
                fetch('http://localhost:8080/admin/edit/' + id,{
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers:{"Content-type": "application/json; charset=UTF-8"}
                })
                    .then(response => {
                        $('#'+ id).replaceWith(
                            '<tr id=' + id + '>' +
                            '<td>' + id + '</td>' +
                            '<td>' + window.formModalEdit.edit_firstName.value + '</td>' +
                            '<td>' + window.formModalEdit.edit_lastName.value + '</td>' +
                            '<td>' + window.formModalEdit.edit_age.value + '</td>' +
                            '<td>' + window.formModalEdit.edit_email.value + '</td>' +
                            '<td>' + listRoles(data) + '</td>' +
                            '<td> <button id="' + id + '" type="button" class="edit btn btn-info" data-toggle="modal">' + 'Edit' + '</button> </td>' +
                            '<td> <button id="' + id + '" type="button" class="delete btn btn-danger" data-toggle="modal" >' + 'Delete' + '</button> </td>' +
                            '</tr>');
                    })
            }
        })
    })

    function getModalEdit(id) {
        fetch('http://localhost:8080/admin/' + id)
            .then(response => response.json())
            .then(data => {
                let adminSelect = "";
                let userSelect = "";

                for (let i = 0; i < data.roles.length; i++) {
                    if (data.roles[i].id === 2) {
                        adminSelect = "selected";
                    }
                    if (data.roles[i].id === 1) {
                        userSelect = "selected";
                    }
                }

                let modal = document.getElementById('modalWindow')
                modal.innerHTML = '<div class="modal fade" id="ModalEdit" tabindex="-1" role="dialog" aria-hidden="true" th:attrappend="id=${user.id}">\n' +
                    '                                                            <div class="modal-dialog modal-dialog-centered" role="document">\n' +
                    '                                                                <div class="modal-content">\n' +
                    '                                                                    <div class="modal-header">\n' +
                    '                                                                        <h5 class="modal-title" id="Update_Title">Edit user</h5>\n' +
                    '                                                                        <button class="close" data-dismiss="modal">x</button>\n' +
                    '                                                                    </div>\n' +
                    '                                                                    <div class="modal-body">\n' +
                    '                                                                        <form id="formModalEdit">\n' +
                    '                                                                            <div class="form-group col-6" >\n' +
                    '                                                                                <div>\n' +
                    '                                                                                    <div class="text-center">\n' +
                    '                                                                                        <strong> ID </strong>\n' +
                    '                                                                                        <br>\n' +
                    '                                                                                        <input  class="form-control" readonly type="number" name="id" value="'+data.id+'" style="background: #ffe8ac">\n' +
                    '                                                                                    </div>\n' +
                    '                                                                                    <div class="text-center">\n' +
                    '                                                                                        <strong> First name</strong>\n' +
                    '                                                                                        <br>\n' +
                    '                                                                                        <input id="edit_firstName" class="form-control" required type="text" name="firstName" value="'+data.firstName+'" style="background: #ffe8ac">\n' +
                    '                                                                                    </div>\n' +
                    '                                                                                    <div class="text-center">\n' +
                    '                                                                                        <strong>Last name</strong>\n' +
                    '                                                                                        <br>\n' +
                    '                                                                                        <input id="edit_lastName" class="form-control" required type="text" name="lastName" value="'+data.lastName+'" style="background: #ffe8ac">\n' +
                    '                                                                                    </div>\n' +
                    '\n' +
                    '                                                                                    <div class="text-center">\n' +
                    '                                                                                        <strong>Email</strong>\n' +
                    '                                                                                        <br>\n' +
                    '                                                                                        <input id="edit_email" class="form-control" required type="email" name="email" value="'+data.email+'" style="background: #ffe8ac">\n' +
                    '                                                                                    </div>\n' +
                    '\n' +
                    '                                                                                    <div class="text-center">\n' +
                    '                                                                                        <strong>Age</strong>\n' +
                    '                                                                                        <br>\n' +
                    '                                                                                        <input id="edit_age" class="form-control" required type="number" name="age" value="'+data.age+'" style="background: #ffe8ac">\n' +
                    '                                                                                    </div>\n' +
                    '\n' +
                    '                                                                                    <div class="text-center">\n' +
                    '                                                                                        <strong>Password</strong>\n' +
                    '                                                                                        <br>\n' +
                    '                                                                                        <input id="edit_password" class="form-control" required type="password" name="password" value="'+data.password+'" style="background: #ffe8ac">\n' +
                    '                                                                                    </div>\n' +
                    '\n' +
                    '                                                                                    <div>\n' +
                    '                                                                                        <br>\n' +
                    '                                                                                        <strong>Role</strong>\n' +
                    '                                                                                        <div>\n' +
                    '                                                                                <select id="select_edit" size="3" multiple class="form-control">\n' +
                    '                                                                                    <option id="edit_adminSelect" value="ADMIN_ROLE" '+ adminSelect + '>ADMIN</option>\n' +
                    '                                                                                    <option id="edit_adminSelect" value="USER_ROLE"' + userSelect + '>USER</option>\n' +
                    '                                                                                </select>\n' +
                    '                                                                                        </div>\n' +
                    '                                                                                    </div>\n' +
                    '                                                                                </div>\n' +
                    '                                                                            </div>\n' +
                    '                                                                        </form>\n' +
                    '                                                                    </div>\n' +
                    '                                                                    <div class="modal-footer">\n' +
                    '                                                                        <button type="button" class="btn btn-secondary"\n' +
                    '                                                                                data-dismiss="modal">Close\n' +
                    '                                                                        </button>\n' +
                    '\n' +
                    '                                                                        <button type="button" class="confirm_edit btn btn-secondary" data-dismiss="modal" >Edit\n' +
                    '                                                                        </button>\n' +
                    '                                                                    </div>\n' +
                    '                                                                    \n' +
                    '\n' +
                    '                                                                </div>\n' +
                    '                                                            </div>\n' +
                    '                                                        </div>'
                $('#ModalEdit').modal()
            })

    }

