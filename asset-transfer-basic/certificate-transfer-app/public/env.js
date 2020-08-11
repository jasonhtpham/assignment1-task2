$(document).ready(function() {
    console.log('Document ready')

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