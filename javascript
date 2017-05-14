<?xml version='1.0' encoding='UTF-8' ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:h="http://xmlns.jcp.org/jsf/html"
      xmlns:p="http://primefaces.org/ui">
	<h:head>
	  <script type="text/javascript">
	    function printHiddenValue(){

	       alert(document.getElementById('myform:hiddenId').value);

	    }
	  </script>
	</h:head>
        
        <h:body>
    	<h1>JSF 2 hidden value example</h1>

	  <h:form id="myform">
    		<h:inputHidden value="#{user.answer}" id="hiddenId" />
                
    		<p:commandButton type="button" value="ClickMe" onclick="printHiddenValue()" />
    	  </h:form>

    </h:body>
        
        
</html>

