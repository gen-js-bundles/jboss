package <%=gen.package%>;

import java.util.List;

<% var genEntity = getGen('../domain/[name_A].java') %>
import $__genEntity.import__$;

public interface <%=gen.name%> {

  <%
  var methods = entity.tags.service.methods;
  if(methods != null) {
    _.each(methods, function(method, methodName) {
  %>
	<%= java.methodSignature(methodName, method, 1)%>
  <%
    });
  }
  %>	
}
