var Servlet = require("./servlet").Servlet;

exports.run = function(app, options) {
    var options = options || {};
    
    var servletHandler = new Servlet(app);
    
    // need to use JavaAdapter form when using module scoping for some reason
    var handler = new JavaAdapter(Packages.org.mortbay.jetty.handler.AbstractHandler, {
        handle : function(target, request, response, dispatch){
            try {
                servletHandler.process(request, response);

                request.setHandled(true);
            } catch(e) {
                print("EXCEPTION: " + e);
                print("    Name:    " + e.name);
                print("    Message: " + e.message);
                print("    File:    " + e.fileName);
                print("    Line:    " + e.lineNumber);
                if (e.javaException)
                {
                    print("    Java Exception: " + e.javaException);
                    e.javaException.printStackTrace();
                }
                if (e.rhinoException)
                {
                    print("    Rhino Exception: " + e.rhinoException);
                    e.rhinoException.printStackTrace();
                }
                throw e;
            }
        }
    });

    var port = options["port"] || 8080,
        server = new Packages.org.mortbay.jetty.Server(port);
        
    print("Jack is starting up using Jetty on port " + port);
    
    server.setHandler(handler);
    server.start();
}

// deprecated
exports.Jetty = exports.Handler = exports;
