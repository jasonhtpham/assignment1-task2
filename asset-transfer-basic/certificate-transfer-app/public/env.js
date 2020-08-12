// const MongoClient = require('mongodb').MongoClient;

// // Load the database object
// const uri = "mongodb+srv://dbUser:dbUser@hyperledgercertificate.hgp6r.mongodb.net/firstdb?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

$(document).ready(function() {
    console.log('Document ready')

    setInterval( () => {
        $.get('/registeredUsers', (users) => {
            $.each(users, (index, userObj) => {
                $('.collection').append(`<li> <a href="#" class="collection-item" id=${userObj._id}>${userObj.firstName} ${userObj.lastName}</a> </li>`);
            });
        })
    },1000)


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
            $('#firstName').val('');
            $('#lastName').val('');
            $('#unitCode').val('');
            $('#grade').val('');
            $('#credit').val('');
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
            $('#firstNameToQuery').val('');
            $('#lastNameToQuery').val('')
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
            $('#certId').val('');
        })
    });
})