$(document).ready(function() {
    console.log('Document ready')
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
        })
    });
})