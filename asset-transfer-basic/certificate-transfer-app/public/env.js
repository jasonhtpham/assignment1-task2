// const MongoClient = require('mongodb').MongoClient;

// // Load the database object
// const uri = "mongodb+srv://dbUser:dbUser@hyperledgercertificate.hgp6r.mongodb.net/firstdb?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

$(document).ready(function() {
    console.log('Document ready')

    
    $('.collapsible').collapsible();
    

    setInterval( () => {
        $.get('/registeredUsers', (users) => {
            $.each(users, (index, userObj) => {
                $('.collapsible').append(
                    `<li> 
                        <div class="collapsible-header">${userObj.firstName} ${userObj.lastName}</div>
                        <div class="collapsible-body">
                            <a href="#create-cert-container" onclick="addName(event)" name="${userObj.firstName} ${userObj.lastName}" class="waves-effect waves-light btn">
                                <i class="material-icons left">add</i>Create Certificate
                            </a>
                            <a href="#get-certs-by-owner-container" onclick="addName(event)" name="${userObj.firstName} ${userObj.lastName}" class="waves-effect waves-light btn">
                                <i class="material-icons left">add</i>Get Certificates
                            </a>
                        </div>
                    </li>`);
            });
        })
    },1000)
/*
<a href="#userList" onclick="addName(event.target.innerText)" class="collection-item" id=${userObj._id}>
                        ${userObj.firstName} ${userObj.lastName}
                        </a>
*/
     

    addName = (event) => {
        const target = event.target.hash;

        const splittedName = event.target.name.split(' ');
        const firstName = splittedName[0];
        const lastName = splittedName[1];

        if (target === '#create-cert-container'){
            $('#firstName').val(firstName);
            $('#lastName').val(lastName);
        }

        if (target === '#get-certs-by-owner-container'){
            $('#firstNameToQuery').val(firstName);
            $('#lastNameToQuery').val(lastName);
        }
    }

    clearValues = () => {
        $('#firstName').val('');
        $('#lastName').val('');
        $('#unitCode').val('');
        $('#grade').val('');
        $('#credit').val('');
        $('#firstNameToQuery').val('');
        $('#lastNameToQuery').val('');
        $('#certId').val('');
    }

    $('#getAllCertsBtn').click( () => {
        $.get('/getAllCerts', (certs) => {
            alert(`Certificates on the ledger:\n${certs}`);
        })
    })

    $('#createCertBtn').click( () => {
        const firstName = $('#firstName').val();
        const lastName = $('#lastName').val();
        const unitCode = $('#unitCode').val();
        const grade = $('#grade').val();
        const credit = $('#credit').val();

        const data = {
            firstName,
            lastName,
            unitCode,
            grade,
            credit
        }

        $.get('/createCert', data, (certId) => {
            alert(`Certificate with ID ${certId} has been created`);
            clearValues();
        })
    });

    $('#getCertByOwnerBtn').click( () => {
        const firstName = $('#firstNameToQuery').val();
        const lastName = $('#lastNameToQuery').val();

        const data = {
            firstName,
            lastName
        }

        $.get('/getCertByOwner', data, (certs) => {
            console.log('Certificates are returned successfully!');
            $('#certs-by-owner').html(certs);
            clearValues();
        })
    });

    $('#getCertHistoryBtn').click( () => {
        const certId = $('#certId').val();

        const data = {
            certId
        }

        $.get('/getCertHistory', data, (certHistory) => {
            console.log('Histories are returned successfully!');
            $('#cert-history').html(certHistory);
            clearValues();
        })
    });
})