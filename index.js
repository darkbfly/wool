const { execFile } = require( 'child_process' );
/*
To enable the initializer feature (https://help.aliyun.com/document_detail/156876.html)
please implement the initializer function as below：
exports.initializer = (context, callback) => {
  console.log('initializing');
  callback(null, '');
};
*/
exports.handler = async ( event, context, callback ) => {
    var eventObj;
    eventObj = JSON.parse( event ).payload
    console.log( `开始执行: 参数为:${ eventObj }` )

    const tasks = [];
    console.log( `run script:${ eventObj }` )
    const name = './' + eventObj + '.js'
    tasks[0] = new Promise( ( resolve ) => {
        const child = execFile( process.execPath, [name] )
        child.stdout.on( 'data', function ( data ) {
            console.log( data )
        } )
        child.stderr.on( 'data', function ( data ) {
            console.error( data )
        } )
        child.on( 'close', function ( code ) {
            console.log( `${ eventObj } finished` )
            delete child
            resolve()
        } )
    } )
    await Promise.all( tasks )

    callback( null, "执行完毕" )
}