<% var rest = current.tags.rest %>
public <%=current.name.A()%>Resource {


<% each(rest.paths, function(pathInfo,path) {%>
  <% each(pathInfo.methods, function(method, methodHttp) {%>
    /* <%=methodHttp%> <%=method.name%> */
    @RequestMapping(value = "<%=path%>",
        method = RequestMethod.<%=methodHttp%>,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public <%=method.return%> <%=method.name%>() {
      <% if(method.body != null) { %>
        <%= java.methodBody(method.name, method.body, 2)%>
      <% } %>
    }


  <%})%>
<%})%>
}
cd