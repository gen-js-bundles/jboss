package <%=gen.package%>;

import java.util.List;

<% var genEntity = getGen('../../domain/[name_A].java') %>
import $__genEntity.import__$;

<% var genService = getGen('../[name_A]Service.java') %>
import $__genService.import__$;

public class <%=gen.name%> implements <%=genService.name%> {

  <%
  var methods = entity.tags.service.methods;
  if(methods != null) {
    _.each(methods, function(method, methodName) {
  %>
	<%= java.method(methodName, method, 1)%>
  <%
    });
  }
  %>	

}
