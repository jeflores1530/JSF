# JSF

package com.nexura.caracterizacion.portlet.vivienda.handler;

import java.io.DataInputStream;
import java.io.IOException;
import java.net.URL;
import java.net.URLConnection;
import java.sql.Blob;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.faces.application.FacesMessage;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.ManagedProperty;
import javax.faces.bean.RequestScoped;
import javax.faces.context.FacesContext;
import javax.xml.bind.ParseConversionEvent;

import org.primefaces.context.RequestContext;
import org.primefaces.json.JSONObject;

import com.liferay.counter.service.CounterLocalServiceUtil;
import com.liferay.portal.kernel.dao.orm.DynamicQuery;
import com.liferay.portal.kernel.dao.orm.DynamicQueryFactoryUtil;
import com.liferay.portal.kernel.dao.orm.QueryUtil;
import com.liferay.portal.kernel.dao.orm.RestrictionsFactoryUtil;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.exception.SystemException;
import com.liferay.portal.kernel.util.ParamUtil;
import com.liferay.portal.kernel.util.Validator;
import com.liferay.portal.model.AddressModel;
import com.liferay.portal.theme.ThemeDisplay;
import com.nexura.caracterizacion.portlet.historicoCiudadano.bean.HistoricoCiudadanoBean;
import com.nexura.caracterizacion.portlet.historicoVivienda.handler.HistoricoViviendaHandler;
import com.nexura.caracterizacion.portlet.unidadProductiva.bean.UnidadProductivaBean;
import com.nexura.caracterizacion.portlet.vivienda.bean.HogaresVo;
import com.nexura.caracterizacion.portlet.vivienda.bean.ViviendaBean;
import com.nexura.caracterizacion.portlet.vivienda.bean.ViviendaVo;
import com.nexura.caracterizacion.services.model.ConfComunaCorregimiento;
import com.nexura.caracterizacion.services.model.ConfCondicionVivienda;
import com.nexura.caracterizacion.services.model.ConfDocumentoPosesion;
import com.nexura.caracterizacion.services.model.ConfMaterialPared;
import com.nexura.caracterizacion.services.model.ConfMaterialPiso;
import com.nexura.caracterizacion.services.model.ConfMaterialTecho;
import com.nexura.caracterizacion.services.model.ConfTipoDocumento;
import com.nexura.caracterizacion.services.model.ConfTipoVivienda;
import com.nexura.caracterizacion.services.model.ConfVeredaBarrioAhdi;
import com.nexura.caracterizacion.services.model.ConfZonaUbicacion;
import com.nexura.caracterizacion.services.model.DataCiudadano;
import com.nexura.caracterizacion.services.model.DataCiudadanoConfTipoRelac;
import com.nexura.caracterizacion.services.model.DataHogar;
import com.nexura.caracterizacion.services.model.DataHogarCiudadano;
import com.nexura.caracterizacion.services.model.DataSede;
import com.nexura.caracterizacion.services.model.DataVivienda;
import com.nexura.caracterizacion.services.model.DataViviendaCiudadano;
import com.nexura.caracterizacion.services.model.DataViviendaConfMaterialPa;
import com.nexura.caracterizacion.services.model.DataViviendaConfMaterialPi;
import com.nexura.caracterizacion.services.model.DataViviendaConfMaterialTe;
import com.nexura.caracterizacion.services.service.ConfComunaCorregimientoLocalServiceUtil;
import com.nexura.caracterizacion.services.service.ConfCondicionViviendaLocalServiceUtil;
import com.nexura.caracterizacion.services.service.ConfDocumentoPosesionLocalServiceUtil;
import com.nexura.caracterizacion.services.service.ConfMaterialParedLocalServiceUtil;
import com.nexura.caracterizacion.services.service.ConfMaterialPisoLocalServiceUtil;
import com.nexura.caracterizacion.services.service.ConfMaterialTechoLocalServiceUtil;
import com.nexura.caracterizacion.services.service.ConfTipoDocumentoLocalServiceUtil;
import com.nexura.caracterizacion.services.service.ConfTipoViviendaLocalServiceUtil;
import com.nexura.caracterizacion.services.service.ConfVeredaBarrioAhdiLocalServiceUtil;
import com.nexura.caracterizacion.services.service.ConfZonaUbicacionLocalServiceUtil;
import com.nexura.caracterizacion.services.service.DataCiudadanoLocalServiceUtil;
import com.nexura.caracterizacion.services.service.DataHogarCiudadanoLocalServiceUtil;
import com.nexura.caracterizacion.services.service.DataHogarLocalServiceUtil;
import com.nexura.caracterizacion.services.service.DataSedeLocalServiceUtil;
import com.nexura.caracterizacion.services.service.DataViviendaCiudadanoLocalServiceUtil;
import com.nexura.caracterizacion.services.service.DataViviendaConfMaterialPaLocalServiceUtil;
import com.nexura.caracterizacion.services.service.DataViviendaConfMaterialPiLocalServiceUtil;
import com.nexura.caracterizacion.services.service.DataViviendaConfMaterialTeLocalServiceUtil;
import com.nexura.caracterizacion.services.service.DataViviendaLocalServiceUtil;
import com.nexura.caracterizacion.services.service.persistence.DataViviendaCiudadanoPK;
import com.nexura.caracterizacion.services.service.persistence.DataViviendaConfMaterialPaPK;
import com.nexura.caracterizacion.services.service.persistence.DataViviendaConfMaterialPiPK;
import com.nexura.caracterizacion.services.service.persistence.DataViviendaConfMaterialTePK;
//import com.nexura.caracterizacion.services.model.Vivienda;
//import com.nexura.caracterizacion.services.service.ViviendaLocalServiceUtil;
import com.nexura.caracterizacion.utilities.BaseHandler;
import com.nexura.caracterizacion.utilities.BreadCrumbVO;

@ManagedBean
@RequestScoped
public class ViviendaHandler extends BaseHandler {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@ManagedProperty(value = "#{viviendaBean}")
	private ViviendaBean viviendaBean;
	@ManagedProperty(value = "#{unidadProductivaBean}")
	private UnidadProductivaBean unidadProductivaBean;

	private String receptor;

	public String getReceptor() {
		// RequestContext.getCurrentInstance().execute("");
		return receptor;
	}

	public void setReceptor(String receptor) {
		this.receptor = receptor;
	}

	// Definición de objetos virtuales para cada pantalla

	private List<BreadCrumbVO> rastroMiga;

	public List<BreadCrumbVO> getRastroMiga() {
		if (rastroMiga == null) {
			rastroMiga = BaseHandler.rastroMigaVO;
		}
		return rastroMiga;
	}

	public void setRastroMiga(List<BreadCrumbVO> rastroMiga) {
		this.rastroMiga = rastroMiga;
	}

	public void adicionarRastroMiga(BreadCrumbVO pantalla) {
		if (BaseHandler.rastroMigaVO.size() != 0) {
			for (int i = 0; i < BaseHandler.rastroMigaVO.size(); i++) {
				if (pantalla == BaseHandler.rastroMigaVO.get(i)) {
					while (i + 1 < BaseHandler.rastroMigaVO.size()) {
						BaseHandler.rastroMigaVO.remove(i + 1);
					}
					break;
				} else if (i == BaseHandler.rastroMigaVO.size() - 1) {
					BaseHandler.rastroMigaVO.add(pantalla);
				}
			}
		} else {
			BaseHandler.rastroMigaVO.add(pantalla);
		}
		setRastroMiga(BaseHandler.rastroMigaVO);
	}

	@PostConstruct
	public void ViviendaHandler() {
		viviendaBean = (ViviendaBean) getFromSession("viviendaBean");
		if (viviendaBean == null) {
			viviendaBean = new ViviendaBean();
		}
		try {

			// List<DataVivienda> viviendas =
			// DataViviendaLocalServiceUtil.getDataViviendas(QueryUtil.ALL_POS,
			// QueryUtil.ALL_POS);

			List<ConfZonaUbicacion> zonas = ConfZonaUbicacionLocalServiceUtil.getConfZonaUbicacions(QueryUtil.ALL_POS,
					QueryUtil.ALL_POS);
			List<ConfTipoVivienda> tipo = ConfTipoViviendaLocalServiceUtil.getConfTipoViviendas(QueryUtil.ALL_POS,
					QueryUtil.ALL_POS);
			List<ConfDocumentoPosesion> posesion = ConfDocumentoPosesionLocalServiceUtil
					.getConfDocumentoPosesions(QueryUtil.ALL_POS, QueryUtil.ALL_POS);
			List<ConfMaterialTecho> techo = ConfMaterialTechoLocalServiceUtil.getConfMaterialTechos(QueryUtil.ALL_POS,
					QueryUtil.ALL_POS);
			List<ConfMaterialPared> pared = ConfMaterialParedLocalServiceUtil.getConfMaterialPareds(QueryUtil.ALL_POS,
					QueryUtil.ALL_POS);
			List<ConfMaterialPiso> piso = ConfMaterialPisoLocalServiceUtil.getConfMaterialPisos(QueryUtil.ALL_POS,
					QueryUtil.ALL_POS);
			List<ConfCondicionVivienda> condicion = ConfCondicionViviendaLocalServiceUtil
					.getConfCondicionViviendas(QueryUtil.ALL_POS, QueryUtil.ALL_POS);

			viviendaBean.setMostrarMapa(false);
			viviendaBean.setMostrarBotonGuardar(false);

			viviendaBean.setCondicion(condicion);
			viviendaBean.setPiso(piso);
			viviendaBean.setPared(pared);
			viviendaBean.setTecho(techo);
			viviendaBean.setPosesion(posesion);
			viviendaBean.setZona(zonas);
			viviendaBean.setTipo(tipo);
			// viviendaBean.setViviendas(viviendas);

			storeOnSession("viviendaBean", viviendaBean);
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	public void exec() {
		FacesContext context = FacesContext.getCurrentInstance();
		Map map = context.getExternalContext().getRequestParameterMap();
		String receptor = (String) map.get("receptor");

		String nombreDireccion = receptor.substring(0, receptor.indexOf("/divisor/"));
		String informacionAdicional = receptor.substring(receptor.indexOf("/divisor/") + "/divisor/".length(),
				receptor.length());
		try {
			viviendaBean.setDireccion(nombreDireccion);
			viviendaBean.setInformacionAdicional(informacionAdicional);
		} catch (Exception e) {
		}
	}

	public void execMapa() {
		FacesContext context = FacesContext.getCurrentInstance();
		Map map = context.getExternalContext().getRequestParameterMap();
		String receptor = (String) map.get("receptor");
		String valorX;
		String valorY;
		String valorBBOX;
		String numeroTecho = viviendaBean.getNumero_ficha().substring(2, 6);

		valorBBOX = receptor.substring(0, receptor.indexOf("BBOX"));
		valorBBOX = valorBBOX.replace(",", "%2C");

		while (receptor.indexOf("x") > -1) {
			receptor = receptor.substring(receptor.indexOf("x") + "x".length(), receptor.length());
		}
		valorX = receptor.substring(receptor.indexOf(":") + ":".length(), receptor.indexOf(","));

		while (receptor.indexOf("y") > -1) {
			receptor = receptor.substring(receptor.indexOf("y") + "y".length(), receptor.length());
		}
		valorY = receptor.substring(receptor.indexOf(":") + ":".length(), receptor.indexOf("}"));

		String url = "http://idesc.cali.gov.co:8081/geoserver/plan_jarillon/wms?REQUEST=GetFeatureInfo&EXCEPTIONS=application%2Fvnd.ogc.se_xml&BBOX="
				+ valorBBOX
				+ "&SERVICE=WMS&INFO_FORMAT=text%2Fhtml&QUERY_LAYERS=plan_jarillon%3Acentroide_techo_pjc&FEATURE_COUNT=50&Layers=plan_jarillon%3Acentroide_techo_pjc&WIDTH=346&HEIGHT=512&format=image%2Fpng&styles=&srs=EPSG%3A6249&version=1.1.1&x="
				+ valorX + "&y=" + valorY + "&cql_filter=techo%20%3D%20" + numeroTecho + "";
		try {
			URL mapa = new URL(url);

			URLConnection mapaConnection = mapa.openConnection();

			DataInputStream dis = new DataInputStream(mapaConnection.getInputStream());

			String inputLine;
			String[] seleccionResultado = new String[2];
			int contador = 0;

			while ((inputLine = dis.readLine()) != null) {
				if (inputLine.equals("      <td>" + numeroTecho + "</td>")) {
					while ((inputLine = dis.readLine()) != null) {
						if (contador < 2) {
							seleccionResultado[contador] = inputLine;
							contador++;
						} else {
							break;
						}
					}
					break;
				}
			}

			String resultadoX = seleccionResultado[0];
			String resultadoY = seleccionResultado[1];

			String coordenadaX = resultadoX.substring(resultadoX.indexOf("      <td>") + "      <td>".length(),
					resultadoX.indexOf("</td>"));
			String coordenadaY = resultadoY.substring(resultadoY.indexOf("      <td>") + "      <td>".length(),
					resultadoY.indexOf("</td>"));

			viviendaBean.setCoordenadaX(coordenadaX);
			viviendaBean.setCoordenadaY(coordenadaY);
			addMessage(null, getI18nMessage("geoRefrencia-guardada"), "");

			dis.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void registrarTecho() {
		viviendaBean.setMostrarMapa(true);
		viviendaBean.setMostrarBotonGuardar(true);
		String numeroTecho = viviendaBean.getNumero_ficha().substring(2, 6);
		viviendaBean.setNumeroTecho(numeroTecho);
	}

	public void capturarCiudadano() {

		long idCiudadano = (long) FacesContext.getCurrentInstance().getExternalContext().getSessionMap()
				.get(BaseHandler.LLAVE_SESSION_ID_CIUDADANO_CARACTERIZADO);
		viviendaBean.setId_data_ciudadano(idCiudadano);
		DataCiudadano ciudadano = null;
		try {
			ciudadano = DataCiudadanoLocalServiceUtil.getDataCiudadano(viviendaBean.getId_data_ciudadano());
		} catch (Exception e) {
			e.printStackTrace();
		}
		viviendaBean.setCiudadano(ciudadano);
		try {
			if(viviendaBean.getCiudadano().getIdConfTipoDocumento()!=4){
			
				DataHogarCiudadano hogarCiudadano = DataHogarCiudadanoLocalServiceUtil
						.getDataHogarCiudadano(ciudadano.getIdDataCiudadano());
				DataHogar viviendaCiudadano = DataHogarLocalServiceUtil.getDataHogar(hogarCiudadano.getIdDataHogar());
				DataVivienda vivienda = DataViviendaLocalServiceUtil.getDataVivienda(viviendaCiudadano.getIdDataVivienda());
				viviendaBean.setVivienda(vivienda);
				viviendaBean.setId_data_hogar(viviendaCiudadano.getIdDataHogar());
				viviendaBean.setNumero_ficha(viviendaCiudadano.getNumeroFicha());
				viviendaBean.setId_data_vivienda(vivienda.getIdDataVivienda());
				/*
				 * BaseHandler baseHandler = new BaseHandler();
				 * baseHandler.addAuditInfo(option, idPrimary, action, info);
				 */
	
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	public String viewViviendas() {
		if (viviendaBean == null) {
			viviendaBean = new ViviendaBean();

		}
		try {
			List<DataVivienda> viviendas = DataViviendaLocalServiceUtil.getDataViviendas(QueryUtil.ALL_POS,
					QueryUtil.ALL_POS);

			viviendaBean.setViviendas(viviendas);
			storeOnSession("viviendaBean", viviendaBean);

		} catch (Exception e) {
			e.printStackTrace();
		}

		return "asociar_vivienda";

	}

	public String viewEditViviendas() {
		if (viviendaBean == null) {
			viviendaBean = new ViviendaBean();

		}
		try {
			// List<DataVivienda> viviendas =
			// DataViviendaLocalServiceUtil.getDataViviendas(QueryUtil.ALL_POS,
			// QueryUtil.ALL_POS);
			//
			// viviendaBean.setViviendas(viviendas);
			storeOnSession("viviendaBean", viviendaBean);
		} catch (Exception e) {
			e.printStackTrace();
		}

		adicionarRastroMiga(RASTROMIGA_VIVIENDA_VERVIVIENDA);
		return "ver_vivienda";

	}

	public String saveVivienda() throws SystemException, PortalException {
		if (Validator.isNull(viviendaBean.getId_data_vivienda())) {
			createVivienda();
		} else {
			updateVivienda();
		}

		return "asociar_vivienda";
	}

	public String editadaVivienda() throws SystemException, PortalException {
		if (Validator.isNull(viviendaBean.getId_data_vivienda())) {
			createVivienda();
		} else {
			updateVivienda();
		}
		// addMessage(null, getI18nMessage("vivienda-modificada"), "");
		return viewEditViviendas();
	}

	public String deleteVivienda() throws SystemException, PortalException {

		if (Validator.isNotNull(viviendaBean.getId_data_vivienda())) {
			DataViviendaLocalServiceUtil.deleteDataVivienda(viviendaBean.getId_data_vivienda());
		}

		return viewViviendas();
	}

	public void reiniciarV() {

		// reiniciacion de nuevas variables
		viviendaBean.setVia("");
		viviendaBean.setNombrevia("");
		viviendaBean.setLetra("");
		viviendaBean.setNumeroseccion("");
		viviendaBean.setLetraseccion("");
		viviendaBean.setBis("");
		viviendaBean.setSector("");
		viviendaBean.setCruce("");
		viviendaBean.setNumeroplaca("");
		viviendaBean.setLetrap("");
		viviendaBean.setNosecp("");
		viviendaBean.setLetrasecp("");
		viviendaBean.setBisp("");
		viviendaBean.setSectorp("");
		viviendaBean.setNumeroplaca2("");
		//
		viviendaBean.setDireccion("");
		viviendaBean.setDireccion_old("");
		viviendaBean.setCantidad_pisos(0);
		viviendaBean.setCantidad_total_cuartos(0);
		viviendaBean.setNombre_poseedor("");
		viviendaBean.setCedula_poseedor("");
		viviendaBean.setId_conf_condicion_vivienda(0);
		viviendaBean.setId_conf_documento_posesion(0);
		viviendaBean.setId_conf_vereda_barrio_ahdi(0);
		viviendaBean.setAfirmacion_tiene_servicio_elec("");
		viviendaBean.setAfirmacion_tiene_factura_elect("");
		viviendaBean.setAfirmacion_tiene_servicio_alca("");
		viviendaBean.setAfirmacion_tiene_factura_alcan("");
		viviendaBean.setAfirmacion_tiene_servicio_gas("");
		viviendaBean.setAfirmacion_tiene_factura_gas("");
		viviendaBean.setAfirmacion_tiene_servicio_tele("");
		viviendaBean.setAfirmacion_tiene_factura_telef("");
		viviendaBean.setAfirmacion_tiene_servicio_reco("");
		viviendaBean.setAfirmacion_tiene_factura_recol("");
		viviendaBean.setAfirmacion_tiene_servicio_acue("");
		viviendaBean.setAfirmacion_tiene_factura_acued("");
		viviendaBean.setId_conf_zona_ubicacion(0);
		viviendaBean.setId_conf_comuna_corregimiento(0);
		viviendaBean.setCanon("");
		viviendaBean.setVisibilidadCanon(viviendaBean.STYLE_INVISIBLE);
		viviendaBean.setId_conf_tipo_vivienda(0);

		viviendaBean.setMaterial_techo_seleccionados(null);
		viviendaBean.setMaterial_pared_seleccionados(null);
		viviendaBean.setMaterial_piso_seleccionados(null);

	}
	
	public boolean esJuridico(){
		
		long idCiudadano = (long) FacesContext.getCurrentInstance().getExternalContext().getSessionMap()
				.get(BaseHandler.LLAVE_SESSION_ID_CIUDADANO_CARACTERIZADO);
		//formEncabezadoBean.setIdCiudadano(idCiudadano);
		DataCiudadano ciudadano;
		try {
			ciudadano = DataCiudadanoLocalServiceUtil.getDataCiudadano(idCiudadano);
			if(ciudadano.getIdConfTipoDocumento()==4){
				return true;
			}else{
				return false;
			}
			
		} catch (Exception e) {
			e.printStackTrace();	
			return false;
		}
	}
	

	public String createVivienda() throws SystemException, PortalException {


		try {
			
			long idCiudadano = (long) FacesContext.getCurrentInstance().getExternalContext().getSessionMap()
					.get(BaseHandler.LLAVE_SESSION_ID_CIUDADANO_CARACTERIZADO);
			//formEncabezadoBean.setIdCiudadano(idCiudadano);
			DataCiudadano ciudadano;

			ciudadano = DataCiudadanoLocalServiceUtil.getDataCiudadano(idCiudadano);
			
			
			List<DataVivienda> viviendasR = DataViviendaLocalServiceUtil.findByDireccion(viviendaBean.getDireccion());

			if (viviendasR.size() == 0) {
				DataVivienda newVivienda = DataViviendaLocalServiceUtil
						.createDataVivienda(CounterLocalServiceUtil.increment(DataVivienda.class.getName()));

				if (viviendaBean.getDireccion() == null || viviendaBean.getDireccion().isEmpty()) {
					this.addError(null, getI18nMessage("error-campo-obligatorio") + " :Dirección", "");
					return "crear_vivienda.xhtml";
				}

				newVivienda.setDireccionInfoAdicional(viviendaBean.getInformacionAdicional());
				viviendaBean.setInformacionAdicional("");

				newVivienda.setDireccion(viviendaBean.getDireccion());

				newVivienda.setCantidadPisos(viviendaBean.getCantidad_pisos());
				newVivienda.setCantidadTotalCuartos(viviendaBean.getCantidad_total_cuartos());

				newVivienda.setNombrePoseedor(viviendaBean.getNombre_poseedor());
				newVivienda.setCedulaPoseedor(viviendaBean.getCedula_poseedor());

				newVivienda.setIdConfTipoVivienda(viviendaBean.getId_conf_tipo_vivienda());// tabla
				newVivienda.setIdConfCondicionVivienda(viviendaBean.getId_conf_condicion_vivienda());
				newVivienda.setIdConfDocumentoPosesion(viviendaBean.getId_conf_documento_posesion());

				newVivienda.setIdConfVeredaBarrioAhdi(viviendaBean.getId_conf_vereda_barrio_ahdi());
				ConfVeredaBarrioAhdi nombre_vereda = ConfVeredaBarrioAhdiLocalServiceUtil
						.getConfVeredaBarrioAhdi(viviendaBean.getId_conf_vereda_barrio_ahdi());
				newVivienda.setConfVeredaBarrioAhdiNombre(nombre_vereda.getNombre());

				newVivienda.setAfirmacionTieneServicioElec(viviendaBean.getAfirmacion_tiene_servicio_elec());
				newVivienda.setAfirmacionTieneFacturaElect(viviendaBean.getAfirmacion_tiene_factura_elect());
				newVivienda.setAfirmacionTieneServicioAlca(viviendaBean.getAfirmacion_tiene_servicio_alca());
				newVivienda.setAfirmacionTieneFacturaAlcan(viviendaBean.getAfirmacion_tiene_factura_alcan());
				newVivienda.setAfirmacionTieneServicioGas(viviendaBean.getAfirmacion_tiene_servicio_gas());
				newVivienda.setAfirmacionTieneFacturaGas(viviendaBean.getAfirmacion_tiene_factura_gas());
				newVivienda.setAfirmacionTieneServicioTele(viviendaBean.getAfirmacion_tiene_servicio_tele());
				newVivienda.setAfirmacionTieneFacturaTelef(viviendaBean.getAfirmacion_tiene_factura_telef());
				newVivienda.setAfirmacionTieneServicioReco(viviendaBean.getAfirmacion_tiene_servicio_reco());
				newVivienda.setAfirmacionTieneFacturaRecol(viviendaBean.getAfirmacion_tiene_factura_recol());
				newVivienda.setAfirmacionTieneServicioAcue(viviendaBean.getAfirmacion_tiene_servicio_acue());
				newVivienda.setAfirmacionTieneFacturaAcued(viviendaBean.getAfirmacion_tiene_factura_acued());
				if (viviendaBean.getId_conf_condicion_vivienda() == 1) {
					newVivienda.setValorCanon(viviendaBean.getCanon());

				}
				newVivienda.setIp(getLoginUserIp());
				newVivienda.setUserId(getUserId());
				java.util.Date utilDate = new java.util.Date();
				java.sql.Timestamp sqlTimestamp = new java.sql.Timestamp(utilDate.getTime());
				newVivienda.setCreatedAt(sqlTimestamp);

				newVivienda.setCoordenadaX(viviendaBean.getCoordenadaX());
				newVivienda.setCoordenadaY(viviendaBean.getCoordenadaY());

				DataViviendaLocalServiceUtil.updateDataVivienda(newVivienda);

				// codigo temporal Direccion unica
				capturarCiudadano();
				viviendaBean.setId_data_vivienda(0);
				List<DataVivienda> busqueda = DataViviendaLocalServiceUtil.findByDireccion(viviendaBean.getDireccion());
				viviendaBean.setId_data_vivienda_seleccionada(busqueda.get(0).getIdDataVivienda());
				newVivienda.setIdDataVivienda(viviendaBean.getId_data_vivienda_seleccionada());
				DataVivienda viviendaActual = null;
				//se comenta codigo y se hace la busqueda por direccion
				// List<DataVivienda> viviendas =
				// DataViviendaLocalServiceUtil.getDataViviendas(QueryUtil.ALL_POS,
				// QueryUtil.ALL_POS);
				// for (int i = 0; i < viviendas.size(); i++) {
				// if
				// (viviendas.get(i).getDireccion().equals(newVivienda.getDireccion()))
				// {
				// viviendaActual = viviendas.get(i);
				// break;
				// }
				// }
				//Se realiza la busqueda directamente a la bd por la direccion para no cargar todas la viviendas
				viviendaActual = DataViviendaLocalServiceUtil.findByDireccion(newVivienda.getDireccion()).get(0);

				List<ConfMaterialTecho> mtecho = ConfMaterialTechoLocalServiceUtil
						.getConfMaterialTechos(QueryUtil.ALL_POS, QueryUtil.ALL_POS);

				if (viviendaBean.getMaterial_techo_seleccionados().length > 0) {
					for (int i = 0; i < viviendaBean.getMaterial_techo_seleccionados().length; i++) {
						// Codigo Temporal para Busqueda de materiales por
						// Nombre,
						// solucion definitiva: Busqueda por Nombre

						for (int j = 0; j < mtecho.size(); j++) {
							if (viviendaBean.getMaterial_techo_seleccionados()[i].equals(mtecho.get(j).getNombre())) {
								DataViviendaConfMaterialTePK viviendaTechoPK = new DataViviendaConfMaterialTePK();
								viviendaTechoPK.setIdConfMaterialTecho(mtecho.get(j).getIdConfMaterialTecho());
								viviendaTechoPK.setIdDataVivienda(viviendaActual.getIdDataVivienda()); // <--
								DataViviendaConfMaterialTe newMaterialT = DataViviendaConfMaterialTeLocalServiceUtil
										.createDataViviendaConfMaterialTe(viviendaTechoPK);
								newMaterialT.setIp(getLoginUserIp());
								newMaterialT.setUserId(getUserId());

								if (viviendaTechoPK.getIdConfMaterialTecho() != 0) {
									DataViviendaConfMaterialTeLocalServiceUtil
											.updateDataViviendaConfMaterialTe(newMaterialT);
								}

							}
						}

					}
				}

				// insertar materiales piso
				List<ConfMaterialPiso> mpiso = ConfMaterialPisoLocalServiceUtil.getConfMaterialPisos(QueryUtil.ALL_POS,
						QueryUtil.ALL_POS);

				if (viviendaBean.getMaterial_piso_seleccionados().length > 0) {
					for (int i = 0; i < viviendaBean.getMaterial_piso_seleccionados().length; i++) {
						// Codigo Temporal para Busqueda de materiales por
						// Nombre,
						// solucion definitiva: Busqueda por Nombre

						for (int j = 0; j < mpiso.size(); j++) {
							if (viviendaBean.getMaterial_piso_seleccionados()[i].equals(mpiso.get(j).getNombre())) {
								DataViviendaConfMaterialPiPK viviendaPisoPK = new DataViviendaConfMaterialPiPK();
								viviendaPisoPK.setIdConfMaterialPiso(mpiso.get(j).getIdConfMaterialPiso());
								viviendaPisoPK.setIdDataVivienda(viviendaActual.getIdDataVivienda()); // <--
																										// +1

								DataViviendaConfMaterialPi newMaterialPi = DataViviendaConfMaterialPiLocalServiceUtil
										.createDataViviendaConfMaterialPi(viviendaPisoPK);

								newMaterialPi.setIp(getLoginUserIp());
								newMaterialPi.setUserId(getUserId());
								if (viviendaPisoPK.getIdConfMaterialPiso() != 0) {
									DataViviendaConfMaterialPiLocalServiceUtil
											.updateDataViviendaConfMaterialPi(newMaterialPi);
								}

							}
						}

					}
				}

				// insertar materiales pared
				List<ConfMaterialPared> mpared = ConfMaterialParedLocalServiceUtil
						.getConfMaterialPareds(QueryUtil.ALL_POS, QueryUtil.ALL_POS);

				if (viviendaBean.getMaterial_pared_seleccionados().length > 0) {
					for (int i = 0; i < viviendaBean.getMaterial_pared_seleccionados().length; i++) {
						// Codigo Temporal para Busqueda de materiales por
						// Nombre,
						// solucion definitiva: Busqueda por Nombre

						for (int j = 0; j < mpared.size(); j++) {
							if (viviendaBean.getMaterial_pared_seleccionados()[i].equals(mpared.get(j).getNombre())) {
								DataViviendaConfMaterialPaPK viviendaParedPK = new DataViviendaConfMaterialPaPK();
								viviendaParedPK.setIdConfMaterialPared(mpared.get(j).getIdConfMaterialPared());
								viviendaParedPK.setIdDataVivienda(viviendaActual.getIdDataVivienda()); // <--

								DataViviendaConfMaterialPa newMaterialPa = DataViviendaConfMaterialPaLocalServiceUtil
										.createDataViviendaConfMaterialPa(viviendaParedPK);
								newMaterialPa.setIp(getLoginUserIp());
								newMaterialPa.setUserId(getUserId());
								if (viviendaParedPK.getIdConfMaterialPared() != 0) {
									DataViviendaConfMaterialPaLocalServiceUtil
											.updateDataViviendaConfMaterialPa(newMaterialPa);
								}

							}
						}

					}
				}
				System.out.println("Asociando hogar");
				if(viviendaBean.getCiudadano().getIdConfTipoDocumento()!=4){
				DataHogar hogarAsociar = DataHogarLocalServiceUtil.getDataHogar(viviendaBean.getId_data_hogar());
				
				DynamicQuery dqHogarCiudadanosJH = DynamicQueryFactoryUtil.forClass(DataHogarCiudadano.class);
				dqHogarCiudadanosJH.add(RestrictionsFactoryUtil.eq("idDataHogar", hogarAsociar.getIdDataHogar()));
				dqHogarCiudadanosJH
						.add(RestrictionsFactoryUtil.eq("idConfParentesco", viviendaBean.ID_PARENTESCO_JEFE));
				List<DataHogarCiudadano> hogarCiudadanoJH = null;
				try {
					hogarCiudadanoJH = DataHogarCiudadanoLocalServiceUtil.dynamicQuery(dqHogarCiudadanosJH);
				} catch (Exception e) {
					String error = getI18nMessage("error-sistema");
					this.addError(null, "", error + "(" + e.getMessage() + ")");
					e.printStackTrace();
				}
				DataCiudadano ciudadanoJH = null;
				if (hogarCiudadanoJH.size() != 0) {
					ciudadanoJH = DataCiudadanoLocalServiceUtil
							.getDataCiudadano(hogarCiudadanoJH.get(0).getIdDataCiudadano());
				}

				ConfTipoDocumento documento = ConfTipoDocumentoLocalServiceUtil
						.getConfTipoDocumento(ciudadanoJH.getIdConfTipoDocumento());

				viviendaBean.setTipo_identificacion(documento.getNombre());

				viviendaBean.setCiudadanoJH(ciudadanoJH);
				viviendaBean.setNumero_ficha(hogarAsociar.getNumeroFicha());
			}else if(viviendaBean.getCiudadano().getIdConfTipoDocumento()==4){
				
				DataViviendaCiudadanoPK dataViviendaCiudadanoPK = new DataViviendaCiudadanoPK(){
					{
						setIdDataCiudadano(viviendaBean.getCiudadano().getIdDataCiudadano());
						setIdDataVivienda(newVivienda.getIdDataVivienda());
					}
				};
				if(viviendaBean.getCiudadano().getIdDataCiudadano()!=0 && newVivienda.getIdDataVivienda()!=0 ){
					DynamicQuery dqViviendaCiudadanos = DynamicQueryFactoryUtil.forClass(DataViviendaCiudadano.class);
					dqViviendaCiudadanos
							.add(RestrictionsFactoryUtil.eq("primaryKey.idDataVivienda",viviendaBean.getCiudadano().getIdDataCiudadano() ));
					dqViviendaCiudadanos
							.add(RestrictionsFactoryUtil.eq("primaryKey.idDataCiudadano", newVivienda.getIdDataVivienda()));
					List<DataViviendaCiudadano> viviendaCiudadano;

					viviendaCiudadano = DataHogarCiudadanoLocalServiceUtil.dynamicQuery(dqViviendaCiudadanos);
			     if(viviendaCiudadano.size()!=0){
			    	  	
			    	 this.addError(null, getI18nMessage("ccn-organizacion-ya-asociada"), "");
			    	// return buscarViviedasCiudadano();
			     }
				
				}
				
				DataViviendaCiudadano newViviendaCiudadano = DataViviendaCiudadanoLocalServiceUtil
						.createDataViviendaCiudadano(dataViviendaCiudadanoPK);
				
				newViviendaCiudadano.setIdDataVivienda(newVivienda.getIdDataVivienda());
				newViviendaCiudadano.setIdDataCiudadano(viviendaBean.getCiudadano().getIdDataCiudadano());
				newViviendaCiudadano.setIp(getLoginUserIp());
				newViviendaCiudadano.setUserId(getUserId());

				DataViviendaCiudadanoLocalServiceUtil.updateDataViviendaCiudadano(newViviendaCiudadano);
				
			}
				//viviendaBean.setNumero_ficha(v);

				FacesContext context = FacesContext.getCurrentInstance();
				context.addMessage(null, new FacesMessage(getI18nMessage("ccn-vivienda-creada")));
				return "buscar_vivienda";
			} else {
				this.addError(null, getI18nMessage("entrada-direccion-unico"), "");
				// return goNew();

			}
		} catch (

		Exception e) {
			String error = getI18nMessage("error-base-datos");
			this.addError(null, "", error + "(" + e.getMessage() + ")");
			govistaPrincipal();
			e.printStackTrace();
		}
		System.out.println("Finalizo guardar vivienda");
		return "null";

	}

	public String asociar() {
		try {
			DataHogar hogarAsociar = DataHogarLocalServiceUtil.getDataHogar(viviendaBean.getId_data_hogar());

			DynamicQuery dqHogarCiudadanosJH = DynamicQueryFactoryUtil.forClass(DataHogarCiudadano.class);
			dqHogarCiudadanosJH.add(RestrictionsFactoryUtil.eq("idDataHogar", hogarAsociar.getIdDataHogar()));
			dqHogarCiudadanosJH.add(RestrictionsFactoryUtil.eq("idConfParentesco", viviendaBean.ID_PARENTESCO_JEFE));
			List<DataHogarCiudadano> hogarCiudadanoJH = null;
			try {
				hogarCiudadanoJH = DataHogarCiudadanoLocalServiceUtil.dynamicQuery(dqHogarCiudadanosJH);
			} catch (Exception e) {
				String error = getI18nMessage("error-sistema");
				this.addError(null, "", error + "(" + e.getMessage() + ")");
				e.printStackTrace();
			}
			DataCiudadano ciudadanoJH = null;
			if (hogarCiudadanoJH.size() != 0) {
				ciudadanoJH = DataCiudadanoLocalServiceUtil
						.getDataCiudadano(hogarCiudadanoJH.get(0).getIdDataCiudadano());
			}

			ConfTipoDocumento documento = ConfTipoDocumentoLocalServiceUtil
					.getConfTipoDocumento(ciudadanoJH.getIdConfTipoDocumento());

			viviendaBean.setTipo_identificacion(documento.getNombre());

			viviendaBean.setCiudadanoJH(ciudadanoJH);
			viviendaBean.setNumero_ficha(hogarAsociar.getNumeroFicha());
		} catch (Exception e) {
			String error = getI18nMessage("error-base-datos");
			this.addError(null, "", error + "(" + e.getMessage() + ")");
			govistaPrincipal();
			e.printStackTrace();
		}
		return "asociar_vivienda";
	}

	public String updateVivienda() throws SystemException, PortalException {

		try {
			List<DataVivienda> viviendasR = DataViviendaLocalServiceUtil.findByDireccion(viviendaBean.getDireccion());

			if (viviendasR.size() == 0 || viviendasR.get(0).getDireccion().equals(viviendaBean.getDireccion_old())) {

				DataVivienda updatedVivienda = DataViviendaLocalServiceUtil
						.getDataVivienda(viviendaBean.getId_data_vivienda());

				if (viviendaBean.getDireccion() == null || viviendaBean.getDireccion().isEmpty()) {
					this.addError(null, getI18nMessage("error-campo-obligatorio") + " :Dirección", "");
					return "crear_vivienda.xhtml";
				}

				updatedVivienda.setDireccionInfoAdicional(viviendaBean.getInformacionAdicional());
				viviendaBean.setInformacionAdicional("");

				viviendaBean.setDireccion(viviendaBean.getDireccion());

				updatedVivienda.setDireccion(viviendaBean.getDireccion());

				updatedVivienda.setCantidadPisos(viviendaBean.getCantidad_pisos());
				updatedVivienda.setCantidadTotalCuartos(viviendaBean.getCantidad_total_cuartos());

				updatedVivienda.setNombrePoseedor(viviendaBean.getNombre_poseedor());
				updatedVivienda.setCedulaPoseedor(viviendaBean.getCedula_poseedor());

				updatedVivienda.setIdConfTipoVivienda(viviendaBean.getId_conf_tipo_vivienda());
				updatedVivienda.setIdConfCondicionVivienda(viviendaBean.getId_conf_condicion_vivienda());
				updatedVivienda.setIdConfDocumentoPosesion(viviendaBean.getId_conf_documento_posesion());
				updatedVivienda.setIdConfVeredaBarrioAhdi(viviendaBean.getId_conf_vereda_barrio_ahdi());

				// Eliminar materiales techo
				// -------------------------------------------

				DynamicQuery dqViviendaMaterialTech = DynamicQueryFactoryUtil
						.forClass(DataViviendaConfMaterialTe.class);
				dqViviendaMaterialTech.add(
						RestrictionsFactoryUtil.eq("primaryKey.idDataVivienda", viviendaBean.getId_data_vivienda()));
				List<DataViviendaConfMaterialTe> viviendaMaterialTech = DataViviendaLocalServiceUtil
						.dynamicQuery(dqViviendaMaterialTech);

				if (viviendaMaterialTech.size() != 0) {
					for (int i = 0; i < viviendaMaterialTech.size(); i++) {
						DataViviendaConfMaterialTeLocalServiceUtil
								.deleteDataViviendaConfMaterialTe(viviendaMaterialTech.get(i));
					}
				}

				// -----------------------------------------------------------------

				// Guardar Materiales Techo
				// -------------------------------------------
				DataViviendaConfMaterialTePK Tepk = new DataViviendaConfMaterialTePK();
				for (int i = 0; i < viviendaBean.getMaterial_techo_seleccionados().length; i++) {
					DynamicQuery dqMaterialesTe = DynamicQueryFactoryUtil.forClass(ConfMaterialTecho.class);
					dqMaterialesTe.add(
							RestrictionsFactoryUtil.eq("nombre", viviendaBean.getMaterial_techo_seleccionados()[i]));
					List<ConfMaterialTecho> materialesTeEncontrados = ConfMaterialTechoLocalServiceUtil
							.dynamicQuery(dqMaterialesTe);
					if (materialesTeEncontrados.size() != 0) {
						// System.out.println("Materiales: " +
						// materialesTeEncontrados.get(0).getIdConfMaterialTecho());
						Tepk.setIdConfMaterialTecho(materialesTeEncontrados.get(0).getIdConfMaterialTecho());
						Tepk.setIdDataVivienda(viviendaBean.getId_data_vivienda());

						DataViviendaConfMaterialTe newViviendaMaterialesTe = DataViviendaConfMaterialTeLocalServiceUtil
								.createDataViviendaConfMaterialTe(Tepk);
						newViviendaMaterialesTe.setIp(getLoginUserIp());
						newViviendaMaterialesTe.setUserId(getUserId());
						if (materialesTeEncontrados.get(0).getIdConfMaterialTecho() != 0) {
							DataViviendaConfMaterialTeLocalServiceUtil
									.updateDataViviendaConfMaterialTe(newViviendaMaterialesTe);
						}
					}
				}
				// ----------------------------------------------------------------------

				// Eliminar materiales Piso
				// -------------------------------------------
				DynamicQuery dqViviendaMaterialPi = DynamicQueryFactoryUtil.forClass(DataViviendaConfMaterialPi.class);
				dqViviendaMaterialPi.add(
						RestrictionsFactoryUtil.eq("primaryKey.idDataVivienda", viviendaBean.getId_data_vivienda()));
				List<DataViviendaConfMaterialPi> viviendaMaterialPi = DataViviendaLocalServiceUtil
						.dynamicQuery(dqViviendaMaterialPi);

				if (viviendaMaterialPi.size() != 0) {
					for (int i = 0; i < viviendaMaterialPi.size(); i++) {
						DataViviendaConfMaterialPiLocalServiceUtil
								.deleteDataViviendaConfMaterialPi(viviendaMaterialPi.get(i));
					}
				}

				// -----------------------------------------------------------------

				// Guardar Materiales Piso
				// ---------------------------------------------
				DataViviendaConfMaterialPiPK Pipk = new DataViviendaConfMaterialPiPK();
				for (int i = 0; i < viviendaBean.getMaterial_piso_seleccionados().length; i++) {
					DynamicQuery dqMaterialesPi = DynamicQueryFactoryUtil.forClass(ConfMaterialPiso.class);
					dqMaterialesPi.add(
							RestrictionsFactoryUtil.eq("nombre", viviendaBean.getMaterial_piso_seleccionados()[i]));
					List<ConfMaterialPiso> materialesPiEncontrados = ConfMaterialPisoLocalServiceUtil
							.dynamicQuery(dqMaterialesPi);
					if (materialesPiEncontrados.size() != 0) {
						// System.out.println("Materiales: " +
						// materialesPiEncontrados.get(0).getIdConfMaterialPiso());
						Pipk.setIdConfMaterialPiso(materialesPiEncontrados.get(0).getIdConfMaterialPiso());
						Pipk.setIdDataVivienda(viviendaBean.getId_data_vivienda());

						DataViviendaConfMaterialPi newViviendaMaterialesPi = DataViviendaConfMaterialPiLocalServiceUtil
								.createDataViviendaConfMaterialPi(Pipk);
						newViviendaMaterialesPi.setIp(getLoginUserIp());
						newViviendaMaterialesPi.setUserId(getUserId());
						if (materialesPiEncontrados.get(0).getIdConfMaterialPiso() != 0) {
							DataViviendaConfMaterialPiLocalServiceUtil
									.updateDataViviendaConfMaterialPi(newViviendaMaterialesPi);
						}
					}
				}
				// ----------------------------------------------------------------------

				// Eliminar materiales Pared
				// -------------------------------------------
				DynamicQuery dqViviendaMaterialPa = DynamicQueryFactoryUtil.forClass(DataViviendaConfMaterialPa.class);
				dqViviendaMaterialPa.add(
						RestrictionsFactoryUtil.eq("primaryKey.idDataVivienda", viviendaBean.getId_data_vivienda()));
				List<DataViviendaConfMaterialPa> viviendaMaterialPa = DataViviendaLocalServiceUtil
						.dynamicQuery(dqViviendaMaterialPa);

				if (viviendaMaterialPa.size() != 0) {
					for (int i = 0; i < viviendaMaterialPa.size(); i++) {
						DataViviendaConfMaterialPaLocalServiceUtil
								.deleteDataViviendaConfMaterialPa(viviendaMaterialPa.get(i));
					}
				}

				// -----------------------------------------------------------------

				// Guardar Materiales
				// Pared---------------------------------------------
				DataViviendaConfMaterialPaPK Papk = new DataViviendaConfMaterialPaPK();
				for (int i = 0; i < viviendaBean.getMaterial_pared_seleccionados().length; i++) {
					DynamicQuery dqMaterialesPa = DynamicQueryFactoryUtil.forClass(ConfMaterialPared.class);
					dqMaterialesPa.add(
							RestrictionsFactoryUtil.eq("nombre", viviendaBean.getMaterial_pared_seleccionados()[i]));
					List<ConfMaterialPared> materialesPaEncontrados = ConfMaterialParedLocalServiceUtil
							.dynamicQuery(dqMaterialesPa);
					if (materialesPaEncontrados.size() != 0) {
						// System.out.println("Materiales: " +
						// materialesPaEncontrados.get(0).getIdConfMaterialPared());
						Papk.setIdConfMaterialPared(materialesPaEncontrados.get(0).getIdConfMaterialPared());
						Papk.setIdDataVivienda(viviendaBean.getId_data_vivienda());

						DataViviendaConfMaterialPa newViviendaMaterialesPa = DataViviendaConfMaterialPaLocalServiceUtil
								.createDataViviendaConfMaterialPa(Papk);
						newViviendaMaterialesPa.setIp(getLoginUserIp());
						newViviendaMaterialesPa.setUserId(getUserId());
						if (materialesPaEncontrados.get(0).getIdConfMaterialPared() != 0) {
							DataViviendaConfMaterialPaLocalServiceUtil
									.updateDataViviendaConfMaterialPa(newViviendaMaterialesPa);
						}
					}
				}
				// ----------------------------------------------------------------------
				if (viviendaBean.getId_conf_condicion_vivienda() == 1) {
					updatedVivienda.setValorCanon(viviendaBean.getCanon());
				}
				updatedVivienda.setAfirmacionTieneServicioElec(viviendaBean.getAfirmacion_tiene_servicio_elec());
				updatedVivienda.setAfirmacionTieneFacturaElect(viviendaBean.getAfirmacion_tiene_factura_elect());
				updatedVivienda.setAfirmacionTieneServicioAlca(viviendaBean.getAfirmacion_tiene_servicio_alca());
				updatedVivienda.setAfirmacionTieneFacturaAlcan(viviendaBean.getAfirmacion_tiene_factura_alcan());
				updatedVivienda.setAfirmacionTieneServicioGas(viviendaBean.getAfirmacion_tiene_servicio_gas());
				updatedVivienda.setAfirmacionTieneFacturaGas(viviendaBean.getAfirmacion_tiene_factura_gas());
				updatedVivienda.setAfirmacionTieneServicioTele(viviendaBean.getAfirmacion_tiene_servicio_tele());
				updatedVivienda.setAfirmacionTieneFacturaTelef(viviendaBean.getAfirmacion_tiene_factura_telef());
				updatedVivienda.setAfirmacionTieneServicioReco(viviendaBean.getAfirmacion_tiene_servicio_reco());
				updatedVivienda.setAfirmacionTieneFacturaRecol(viviendaBean.getAfirmacion_tiene_factura_recol());
				updatedVivienda.setAfirmacionTieneServicioAcue(viviendaBean.getAfirmacion_tiene_servicio_acue());
				updatedVivienda.setAfirmacionTieneFacturaAcued(viviendaBean.getAfirmacion_tiene_factura_acued());
				updatedVivienda.setIp(getLoginUserIp());
				updatedVivienda.setUserId(getUserId());

				// java.util.Date utilDate = new java.util.Date();
				// java.sql.Timestamp sqlTimestamp = new
				// java.sql.Timestamp(utilDate.getTime());
				// updatedVivienda.setUpdatedAt(sqlTimestamp);

				updatedVivienda.setCoordenadaX(viviendaBean.getCoordenadaX());
				updatedVivienda.setCoordenadaY(viviendaBean.getCoordenadaY());

				DataViviendaLocalServiceUtil.updateDataVivienda(updatedVivienda);

				addMessage(null, getI18nMessage("vivienda-modificada"), "");
				return goVerVivienda();
			} else {
				this.addError(null, getI18nMessage("entrada-direccion-unico"), "");
				return goEditVivienda();
			}
		} catch (Exception e) {
			govistaPrincipal();
			e.printStackTrace();
		}
		return "null";
	}

	public String historicoVivienda() {
		try {
			HistoricoViviendaHandler vivienda = new HistoricoViviendaHandler();
			vivienda.limpiar();
			FacesContext.getCurrentInstance().getExternalContext()
					.redirect("/views/portlet/historicoVivienda/view.xhtml");
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}

	public String goNew() throws SystemException, PortalException {

		try {
			capturarCiudadano();

			viviendaBean.setNumero_ficha(viviendaBean.getNumero_ficha());
			if(viviendaBean.getCiudadano().getIdConfTipoDocumento()!=4){
			viviendaBean.setNumeroTecho(viviendaBean.getNumero_ficha().substring(2, 6));
			}
			reiniciarV();
			viviendaBean.setId_data_vivienda(0);
			List<ConfZonaUbicacion> zonas = ConfZonaUbicacionLocalServiceUtil.getConfZonaUbicacions(QueryUtil.ALL_POS,
					QueryUtil.ALL_POS);
			List<ConfTipoVivienda> tipo = ConfTipoViviendaLocalServiceUtil.getConfTipoViviendas(QueryUtil.ALL_POS,
					QueryUtil.ALL_POS);
			List<ConfDocumentoPosesion> posesion = ConfDocumentoPosesionLocalServiceUtil
					.getConfDocumentoPosesions(QueryUtil.ALL_POS, QueryUtil.ALL_POS);
			List<ConfMaterialTecho> techo = ConfMaterialTechoLocalServiceUtil.getConfMaterialTechos(QueryUtil.ALL_POS,
					QueryUtil.ALL_POS);
			List<ConfMaterialPared> pared = ConfMaterialParedLocalServiceUtil.getConfMaterialPareds(QueryUtil.ALL_POS,
					QueryUtil.ALL_POS);
			List<ConfMaterialPiso> piso = ConfMaterialPisoLocalServiceUtil.getConfMaterialPisos(QueryUtil.ALL_POS,
					QueryUtil.ALL_POS);
			List<ConfCondicionVivienda> condicion = ConfCondicionViviendaLocalServiceUtil
					.getConfCondicionViviendas(QueryUtil.ALL_POS, QueryUtil.ALL_POS);
			// List<ConfVeredaBarrioAhdi> barrio =
			// ConfVeredaBarrioAhdiLocalServiceUtil.getConfVeredaBarrioAhdis(QueryUtil.ALL_POS,
			// QueryUtil.ALL_POS);
			ConfVeredaBarrioAhdi nombre_vereda = ConfVeredaBarrioAhdiLocalServiceUtil
					.getConfVeredaBarrioAhdi(viviendaBean.getId_conf_vereda_barrio_ahdi());
			nombre_vereda.getNombre();

			viviendaBean.setConf_vereda_barrio_ahdi_nombre(nombre_vereda.getNombre());

			viviendaBean.setVisibilidadCanon(viviendaBean.STYLE_INVISIBLE);

			viviendaBean.setCondicion(condicion);
			viviendaBean.setPiso(piso);
			viviendaBean.setPared(pared);
			viviendaBean.setTecho(techo);
			viviendaBean.setPosesion(posesion);
			viviendaBean.setZona(zonas);
			viviendaBean.setTipo(tipo);
			// viviendaBean.setVereda(barrio);

			storeOnSession("viviendaBean", viviendaBean);
		} catch (Exception e) {
			govistaPrincipal();
			e.printStackTrace();
		}

		adicionarRastroMiga(RASTROMIGA_VIVIENDA_CREARVIVIENDA);
		return "crear_vivienda";
	}

	public String goEditVivienda() throws PortalException, SystemException {
		try {

			capturarCiudadano();

			if (Validator.isNotNull(viviendaBean.getId_data_vivienda())) {
				DataVivienda vivienda = DataViviendaLocalServiceUtil
						.getDataVivienda(viviendaBean.getId_data_vivienda());

				// System.out.println("Id Barrio:
				// "+viviendaBean.getId_conf_vereda_barrio_ahdi());

				viviendaBean.setId_data_vivienda(vivienda.getIdDataVivienda());

				// System.out.println("Id Barrio:

				viviendaBean.setId_data_vivienda(vivienda.getIdDataVivienda());

				viviendaBean.setInformacionAdicional(vivienda.getDireccionInfoAdicional());
				viviendaBean.setDireccion(vivienda.getDireccion());

				if (viviendaBean.getId_conf_condicion_vivienda() == 1) {

					viviendaBean.setVisibilidadCanon(viviendaBean.STYLE_VISIBLE);

				} else {
					viviendaBean.setVisibilidadCanon(viviendaBean.STYLE_INVISIBLE);
				}

				// nuevos datos para el metodo editarviv
				if (viviendaBean.getId_conf_condicion_vivienda() == 1) {
					viviendaBean.setCanon(vivienda.getValorCanon());
				}
				viviendaBean.setCantidad_pisos(vivienda.getCantidadPisos());
				viviendaBean.setCantidad_total_cuartos(vivienda.getCantidadTotalCuartos());

				viviendaBean.setNombre_poseedor(vivienda.getNombrePoseedor());
				viviendaBean.setCedula_poseedor(vivienda.getCedulaPoseedor());

				viviendaBean.setId_conf_tipo_vivienda(vivienda.getIdConfTipoVivienda());
				viviendaBean.setId_conf_condicion_vivienda(vivienda.getIdConfCondicionVivienda());
				viviendaBean.setId_conf_documento_posesion(vivienda.getIdConfDocumentoPosesion());

				ConfVeredaBarrioAhdi veredaBarrio = ConfVeredaBarrioAhdiLocalServiceUtil
						.getConfVeredaBarrioAhdi(vivienda.getIdConfVeredaBarrioAhdi());

				viviendaBean.setId_conf_vereda_barrio_ahdi(vivienda.getIdConfVeredaBarrioAhdi());

				ConfComunaCorregimiento comuna = ConfComunaCorregimientoLocalServiceUtil
						.getConfComunaCorregimiento(veredaBarrio.getIdConfComunaCorregimiento());

				viviendaBean.setId_conf_comuna_corregimiento(comuna.getIdConfComunaCorregimiento());

				onEncontrarBarrio();

				ConfZonaUbicacion zonas = ConfZonaUbicacionLocalServiceUtil
						.getConfZonaUbicacion(comuna.getIdConfZonaUbicacion());

				viviendaBean.setId_conf_zona_ubicacion(zonas.getIdConfZonaUbicacion());

				onEncontrarCorregimiento();

				// listar materiales techo
				DynamicQuery dqViviendaMaterialTech = DynamicQueryFactoryUtil
						.forClass(DataViviendaConfMaterialTe.class);
				dqViviendaMaterialTech
						.add(RestrictionsFactoryUtil.eq("primaryKey.idDataVivienda", vivienda.getIdDataVivienda()));
				List<DataViviendaConfMaterialTe> viviendaMaterialTech = DataViviendaLocalServiceUtil
						.dynamicQuery(dqViviendaMaterialTech);

				String[] nombresTE = new String[viviendaMaterialTech.size()];
				for (int i = 0; i < viviendaMaterialTech.size(); i++) {

					ConfMaterialTecho materialTechSeleccionados = ConfMaterialTechoLocalServiceUtil
							.getConfMaterialTecho(viviendaMaterialTech.get(i).getIdConfMaterialTecho());

					nombresTE[i] = materialTechSeleccionados.getNombre();

				}

				// listar materiales piso
				DynamicQuery dqViviendaMaterialPi = DynamicQueryFactoryUtil.forClass(DataViviendaConfMaterialPi.class);
				dqViviendaMaterialPi
						.add(RestrictionsFactoryUtil.eq("primaryKey.idDataVivienda", vivienda.getIdDataVivienda()));
				List<DataViviendaConfMaterialPi> viviendaMaterialPi = DataViviendaLocalServiceUtil
						.dynamicQuery(dqViviendaMaterialPi);

				String[] nombresPI = new String[viviendaMaterialPi.size()];
				for (int j = 0; j < viviendaMaterialPi.size(); j++) {

					ConfMaterialPiso materialPiSeleccionados = ConfMaterialPisoLocalServiceUtil
							.getConfMaterialPiso(viviendaMaterialPi.get(j).getIdConfMaterialPiso());

					nombresPI[j] = materialPiSeleccionados.getNombre();
				}

				// listar materiales pared
				DynamicQuery dqViviendaMaterialPa = DynamicQueryFactoryUtil.forClass(DataViviendaConfMaterialPa.class);
				dqViviendaMaterialPa
						.add(RestrictionsFactoryUtil.eq("primaryKey.idDataVivienda", vivienda.getIdDataVivienda()));
				List<DataViviendaConfMaterialPa> viviendaMaterialPa = DataViviendaLocalServiceUtil
						.dynamicQuery(dqViviendaMaterialPa);

				String[] nombresPA = new String[viviendaMaterialPa.size()];
				for (int j = 0; j < viviendaMaterialPa.size(); j++) {

					ConfMaterialPared materialPaSeleccionados = ConfMaterialParedLocalServiceUtil
							.getConfMaterialPared(viviendaMaterialPa.get(j).getIdConfMaterialPared());

					nombresPA[j] = materialPaSeleccionados.getNombre();
				}

				// Collections.sort(materialPaSeleccionados);
				Arrays.sort(nombresTE);
				Arrays.sort(nombresPI);
				Arrays.sort(nombresPA);
				viviendaBean.setMaterial_techo_seleccionados(nombresTE);
				viviendaBean.setMaterial_piso_seleccionados(nombresPI);
				viviendaBean.setMaterial_pared_seleccionados(nombresPA);

				viviendaBean.setAfirmacion_tiene_servicio_elec(vivienda.getAfirmacionTieneServicioElec());
				viviendaBean.setAfirmacion_tiene_factura_elect(vivienda.getAfirmacionTieneFacturaElect());
				viviendaBean.setAfirmacion_tiene_servicio_alca(vivienda.getAfirmacionTieneServicioAlca());
				viviendaBean.setAfirmacion_tiene_factura_alcan(vivienda.getAfirmacionTieneFacturaAlcan());
				viviendaBean.setAfirmacion_tiene_servicio_gas(vivienda.getAfirmacionTieneServicioGas());
				viviendaBean.setAfirmacion_tiene_factura_gas(vivienda.getAfirmacionTieneFacturaGas());
				viviendaBean.setAfirmacion_tiene_servicio_tele(vivienda.getAfirmacionTieneServicioTele());
				viviendaBean.setAfirmacion_tiene_factura_telef(vivienda.getAfirmacionTieneFacturaTelef());
				viviendaBean.setAfirmacion_tiene_servicio_reco(vivienda.getAfirmacionTieneServicioReco());
				viviendaBean.setAfirmacion_tiene_factura_recol(vivienda.getAfirmacionTieneFacturaRecol());
				viviendaBean.setAfirmacion_tiene_servicio_acue(vivienda.getAfirmacionTieneServicioAcue());
				viviendaBean.setAfirmacion_tiene_factura_acued(vivienda.getAfirmacionTieneFacturaAcued());

			}
			storeOnSession("viviendaBean", viviendaBean);
		} catch (Exception e) {
			govistaPrincipal();
			e.printStackTrace();
		}
		return "editar-vivienda";
	}

	public ViviendaBean getViviendaBean() {
		return viviendaBean;
	}

	public void setViviendaBean(ViviendaBean viviendaBean) {
		this.viviendaBean = viviendaBean;
	}

	public String init() {

		return "";
	}

	public String goVerVivienda() throws SystemException, PortalException {
		try {
			capturarCiudadano();

			if (Validator.isNotNull(viviendaBean.getId_data_vivienda())) {
				DataVivienda vivienda = null;

				try {
					vivienda = DataViviendaLocalServiceUtil.getDataVivienda(viviendaBean.getId_data_vivienda());
				} catch (Exception e) {
					String error = getI18nMessage("error-sistema-obtener-vivienda-id");
					this.addError(null, "", error + "(" + e.getMessage() + ")");
					e.printStackTrace();
				}

				DataHogarCiudadano dtHogar = DataHogarCiudadanoLocalServiceUtil
						.getDataHogarCiudadano(viviendaBean.getId_data_ciudadano());
				DataHogar hogar = DataHogarLocalServiceUtil.getDataHogar(dtHogar.getIdDataHogar());

				viviendaBean.setHogar(hogar);

				// viviendaBean.setNumero_ficha(hogar.getNumeroFicha());
				long idParentesco = 1;
				DynamicQuery dqHogarCiudadanosJH = DynamicQueryFactoryUtil.forClass(DataHogarCiudadano.class);
				dqHogarCiudadanosJH.add(RestrictionsFactoryUtil.eq("idDataHogar", hogar.getIdDataHogar()));
				dqHogarCiudadanosJH
						.add(RestrictionsFactoryUtil.eq("idConfParentesco", viviendaBean.ID_PARENTESCO_JEFE));
				List<DataHogarCiudadano> hogarCiudadanoJH = null;
				try {
					hogarCiudadanoJH = DataHogarCiudadanoLocalServiceUtil.dynamicQuery(dqHogarCiudadanosJH);
				} catch (Exception e) {
					String error = getI18nMessage("error-sistema");
					this.addError(null, "", error + "(" + e.getMessage() + ")");
					e.printStackTrace();
				}
				DataCiudadano ciudadanoJH = null;
				if (hogarCiudadanoJH.size() != 0) {
					ciudadanoJH = DataCiudadanoLocalServiceUtil
							.getDataCiudadano(hogarCiudadanoJH.get(0).getIdDataCiudadano());
				}

				ConfTipoDocumento documento = ConfTipoDocumentoLocalServiceUtil
						.getConfTipoDocumento(ciudadanoJH.getIdConfTipoDocumento());

				viviendaBean.setTipo_identificacion(documento.getNombre());

				viviendaBean.setCiudadanoJH(ciudadanoJH);

				viviendaBean.setId_data_vivienda(vivienda.getIdDataVivienda());
				viviendaBean.setDireccion(vivienda.getDireccion());

				viviendaBean.setCantidad_pisos(vivienda.getCantidadPisos());
				viviendaBean.setCantidad_total_cuartos(vivienda.getCantidadTotalCuartos());

				viviendaBean.setNombre_poseedor(vivienda.getNombrePoseedor());
				viviendaBean.setCedula_poseedor(vivienda.getCedulaPoseedor());

				viviendaBean.setId_conf_tipo_vivienda(vivienda.getIdConfTipoVivienda());
				viviendaBean.setId_conf_condicion_vivienda(vivienda.getIdConfCondicionVivienda());
				viviendaBean.setId_conf_documento_posesion(vivienda.getIdConfDocumentoPosesion());

				ConfTipoVivienda tipo_vivienda = ConfTipoViviendaLocalServiceUtil
						.getConfTipoVivienda(viviendaBean.getId_conf_tipo_vivienda());
				viviendaBean.setNombre_conf_tipo_vivienda(tipo_vivienda.getNombre());

				ConfCondicionVivienda condicion = ConfCondicionViviendaLocalServiceUtil
						.getConfCondicionVivienda(viviendaBean.getId_conf_condicion_vivienda());
				viviendaBean.setNombre_conf_condicion_vivienda(condicion.getNombre());

				ConfDocumentoPosesion posesion = ConfDocumentoPosesionLocalServiceUtil
						.getConfDocumentoPosesion(viviendaBean.getId_conf_documento_posesion());
				viviendaBean.setNombre_conf_documento_posesion(posesion.getNombre());

				ConfVeredaBarrioAhdi veredaBarrio = ConfVeredaBarrioAhdiLocalServiceUtil
						.getConfVeredaBarrioAhdi(vivienda.getIdConfVeredaBarrioAhdi());

				viviendaBean.setConf_vereda_barrio_ahdi_nombre(veredaBarrio.getNombre());

				ConfComunaCorregimiento comuna = ConfComunaCorregimientoLocalServiceUtil
						.getConfComunaCorregimiento(veredaBarrio.getIdConfComunaCorregimiento());

				viviendaBean.setConf_comuna_corregimiento_nombre(comuna.getNombre());

				ConfZonaUbicacion zonas = ConfZonaUbicacionLocalServiceUtil
						.getConfZonaUbicacion(comuna.getIdConfZonaUbicacion());

				viviendaBean.setConf_zona_ubicacion_nombre(zonas.getNombre());

				DynamicQuery dqViviendaMaterialTech = DynamicQueryFactoryUtil
						.forClass(DataViviendaConfMaterialTe.class);
				dqViviendaMaterialTech
						.add(RestrictionsFactoryUtil.eq("primaryKey.idDataVivienda", vivienda.getIdDataVivienda()));
				List<DataViviendaConfMaterialTe> viviendaMaterialTech = DataViviendaLocalServiceUtil
						.dynamicQuery(dqViviendaMaterialTech);

				String[] nombresTE = new String[viviendaMaterialTech.size()];
				for (int i = 0; i < viviendaMaterialTech.size(); i++) {

					ConfMaterialTecho materialTechSeleccionados = ConfMaterialTechoLocalServiceUtil
							.getConfMaterialTecho(viviendaMaterialTech.get(i).getIdConfMaterialTecho());

					nombresTE[i] = materialTechSeleccionados.getNombre();
				}

				// listar materiales piso
				DynamicQuery dqViviendaMaterialPi = DynamicQueryFactoryUtil.forClass(DataViviendaConfMaterialPi.class);
				dqViviendaMaterialPi
						.add(RestrictionsFactoryUtil.eq("primaryKey.idDataVivienda", vivienda.getIdDataVivienda()));
				List<DataViviendaConfMaterialPi> viviendaMaterialPi = DataViviendaLocalServiceUtil
						.dynamicQuery(dqViviendaMaterialPi);

				String[] nombresPI = new String[viviendaMaterialPi.size()];
				for (int j = 0; j < viviendaMaterialPi.size(); j++) {

					ConfMaterialPiso materialPiSeleccionados = ConfMaterialPisoLocalServiceUtil
							.getConfMaterialPiso(viviendaMaterialPi.get(j).getIdConfMaterialPiso());

					nombresPI[j] = materialPiSeleccionados.getNombre();
				}

				// listar materiales pared
				DynamicQuery dqViviendaMaterialPa = DynamicQueryFactoryUtil.forClass(DataViviendaConfMaterialPa.class);
				dqViviendaMaterialPa
						.add(RestrictionsFactoryUtil.eq("primaryKey.idDataVivienda", vivienda.getIdDataVivienda()));
				List<DataViviendaConfMaterialPa> viviendaMaterialPa = DataViviendaLocalServiceUtil
						.dynamicQuery(dqViviendaMaterialPa);

				String[] nombresPA = new String[viviendaMaterialPa.size()];
				for (int j = 0; j < viviendaMaterialPa.size(); j++) {

					ConfMaterialPared materialPaSeleccionados = ConfMaterialParedLocalServiceUtil
							.getConfMaterialPared(viviendaMaterialPa.get(j).getIdConfMaterialPared());

					nombresPA[j] = materialPaSeleccionados.getNombre();
				}

				Arrays.sort(nombresTE);
				Arrays.sort(nombresPI);
				Arrays.sort(nombresPA);
				viviendaBean.setMaterial_techo_seleccionados(nombresTE);
				viviendaBean.setMaterial_piso_seleccionados(nombresPI);
				viviendaBean.setMaterial_pared_seleccionados(nombresPA);
				viviendaBean.setDireccion_old(vivienda.getDireccion());
				viviendaBean.setAfirmacion_tiene_servicio_elec(vivienda.getAfirmacionTieneServicioElec());
				viviendaBean.setAfirmacion_tiene_factura_elect(vivienda.getAfirmacionTieneFacturaElect());
				viviendaBean.setAfirmacion_tiene_servicio_alca(vivienda.getAfirmacionTieneServicioAlca());
				viviendaBean.setAfirmacion_tiene_factura_alcan(vivienda.getAfirmacionTieneFacturaAlcan());
				viviendaBean.setAfirmacion_tiene_servicio_gas(vivienda.getAfirmacionTieneServicioGas());
				viviendaBean.setAfirmacion_tiene_factura_gas(vivienda.getAfirmacionTieneFacturaGas());
				viviendaBean.setAfirmacion_tiene_servicio_tele(vivienda.getAfirmacionTieneServicioTele());
				viviendaBean.setAfirmacion_tiene_factura_telef(vivienda.getAfirmacionTieneFacturaTelef());
				viviendaBean.setAfirmacion_tiene_servicio_reco(vivienda.getAfirmacionTieneServicioReco());
				viviendaBean.setAfirmacion_tiene_factura_recol(vivienda.getAfirmacionTieneFacturaRecol());
				viviendaBean.setAfirmacion_tiene_servicio_acue(vivienda.getAfirmacionTieneServicioAcue());
				viviendaBean.setAfirmacion_tiene_factura_acued(vivienda.getAfirmacionTieneFacturaAcued());
				if (viviendaBean.getId_conf_condicion_vivienda() == 1) {

					viviendaBean.setVisibilidadCanon(viviendaBean.STYLE_VISIBLE);

				} else {
					viviendaBean.setVisibilidadCanon(viviendaBean.STYLE_INVISIBLE);
				}

				if (viviendaBean.getId_conf_condicion_vivienda() == 1) {

					viviendaBean.setCanon(vivienda.getValorCanon());
				}

				// auditoria info
				String option = "datos-vivienda";
				long idPrimary = viviendaBean.getId_data_ciudadano();
				String action = "Ver Datos de la vivienda";
				JSONObject obj = new JSONObject();
				obj.put("Ficha hogar", hogar.getNumeroFicha());
				obj.put("Id vivienda", viviendaBean.getId_data_vivienda());

				obj.put("Dirección", viviendaBean.getDireccion());
				obj.put("Zona", viviendaBean.getConf_zona_ubicacion_nombre());
				obj.put("Vereda/barrio", viviendaBean.getConf_vereda_barrio_ahdi_nombre());
				obj.put("Tipo vivienda", viviendaBean.getNombre_conf_tipo_vivienda());
				obj.put("La vivienda donde habita es:", viviendaBean.getNombre_conf_condicion_vivienda());
				obj.put("Nombre poseedor", viviendaBean.getNombre_poseedor());
				obj.put("Cedula del poseedor", viviendaBean.getCedula_poseedor());
				obj.put("Documento poseción", viviendaBean.getNombre_conf_documento_posesion());
				obj.put("Cantidad pisos", viviendaBean.getCantidad_pisos());
				obj.put("Cantidad total cuartos", viviendaBean.getCantidad_total_cuartos());
				obj.put("Materiales pisos", viviendaBean.getMaterial_piso_seleccionados());
				obj.put("Matriales techo", viviendaBean.getMaterial_techo_seleccionados());
				obj.put("Materiales pared", viviendaBean.getMaterial_pared_seleccionados());
				obj.put("Tiene servicio electrico", viviendaBean.getAfirmacion_tiene_servicio_elec());
				obj.put("Tiene factura electrico", viviendaBean.getAfirmacion_tiene_factura_elect());
				obj.put("Tiene servicio alcantarillado", viviendaBean.getAfirmacion_tiene_servicio_alca());
				obj.put("Tiene factura alcantarillado", viviendaBean.getAfirmacion_tiene_factura_alcan());
				obj.put("Tiene servicio gas", viviendaBean.getAfirmacion_tiene_servicio_gas());
				obj.put("Tiene factura gas", viviendaBean.getAfirmacion_tiene_factura_gas());
				obj.put("Tiene servicio telefonico", viviendaBean.getAfirmacion_tiene_servicio_tele());
				obj.put("Tiene factura telefonica", viviendaBean.getAfirmacion_tiene_factura_telef());
				obj.put("Tiene servicio recolección de basura", viviendaBean.getAfirmacion_tiene_servicio_reco());
				obj.put("Tiene factura recolección de basura", viviendaBean.getAfirmacion_tiene_factura_recol());
				obj.put("Tiene servicio de acueducto", viviendaBean.getAfirmacion_tiene_servicio_acue());
				obj.put("Tiene factura acueducto", viviendaBean.getAfirmacion_tiene_factura_acued());
				obj.put("Tipo identificacion jefe de hogar", viviendaBean.getTipo_identificacion());
				obj.put("Numero identificacion jefe de hogar", ciudadanoJH.getNumeroIdentificacion());
				obj.put("Primer nombre jefe hogar", ciudadanoJH.getPrimerNombre());
				obj.put("Segundo nombre jefe hogar", ciudadanoJH.getSegundoNombre());
				obj.put("Primer Apellido", ciudadanoJH.getPrimerApellido());
				obj.put("Segundo Apellido", ciudadanoJH.getSegundoApellido());
				// System.out.println("objeto json"+obj);

				String info = obj.toString();

				addAuditInfo(option, idPrimary, action, info);

			}
			storeOnSession("viviendaBean", viviendaBean);

		} catch (Exception e) {
			govistaPrincipal();
			e.printStackTrace();
		}

		adicionarRastroMiga(RASTROMIGA_VIVIENDA_VERVIVIENDA);
		return "ver_vivienda";
	}

	public String goBuscarVivienda() {
		try {
			capturarCiudadano();
			if (Validator.isNotNull(viviendaBean.getCiudadano())) {

				List<ViviendaVo> viviendasVo = new ArrayList<ViviendaVo>();
				List<DataVivienda> viviendas = null;
				
				if(viviendaBean.getCiudadano().getIdConfTipoDocumento()!=4){
					
					DataHogarCiudadano dtHogar = DataHogarCiudadanoLocalServiceUtil
							.getDataHogarCiudadano(viviendaBean.getId_data_ciudadano());
					DataHogar hogar = DataHogarLocalServiceUtil.getDataHogar(dtHogar.getIdDataHogar());
					viviendaBean.setHogar(hogar);
					viviendaBean.setNumero_ficha(hogar.getNumeroFicha());
				}
				
				viviendaBean.setViviendasVo(viviendasVo);
				viviendaBean.setViviendas(viviendas);
				DataCiudadano ciudadano = DataCiudadanoLocalServiceUtil
						.getDataCiudadano(viviendaBean.getId_data_ciudadano());
				viviendaBean.setCiudadano(ciudadano);
				viviendaBean.setId_data_hogar_asociar(0);
				viviendaBean.setId_data_hogar_excluir(0);
				viviendaBean.setId_data_vivienda_seleccionada(0);
				viviendaBean.setId_data_vivienda(0);
				viviendaBean.setDireccion("");
				viviendaBean.setFiltroDireccion("");
				viviendaBean.setFiltroTecho("");
				storeOnSession("viviendaBean", viviendaBean);

			}

		} catch (Exception e) {
			govistaPrincipal();
			e.printStackTrace();
		}

		adicionarRastroMiga(RASTROMIGA_VIVIENDA_BUSCARVIVIENDA);
		return "buscar-vivienda";
	}

	public void buscarVivienda() {
		try {
			if (viviendaBean == null) {
				viviendaBean = new ViviendaBean();
			}

			if (viviendaBean.getFiltroDireccion().trim().isEmpty() != true
					&& viviendaBean.getFiltroDireccion().trim().equals("%") != true
					&& viviendaBean.getFiltroDireccion() != "") {

				List<DataVivienda> vivienda = null;

				vivienda = DataViviendaLocalServiceUtil.findByDireccionNoCSNoAccentos(viviendaBean.getFiltroDireccion(),
						QueryUtil.ALL_POS, QueryUtil.ALL_POS);

				List<ViviendaVo> viviendasVo = new ArrayList<ViviendaVo>();

				vivienda.stream().forEach(viviendaB -> viviendasVo.add(new ViviendaVo(viviendaB)));
				viviendaBean.setViviendasVo(viviendasVo);
				storeOnSession("viviendaBean", viviendaBean);

			}

			else if (viviendaBean.getFiltroTecho().trim().isEmpty() != true
					&& viviendaBean.getFiltroTecho().trim().equals("%") != true
					&& viviendaBean.getFiltroTecho() != "") {
				List<DataVivienda> viviendas = DataViviendaLocalServiceUtil.findByTecho(viviendaBean.getFiltroTecho(),
						QueryUtil.ALL_POS, QueryUtil.ALL_POS);
				List<DataVivienda> viviendasSin = new ArrayList<DataVivienda>();

				int i = 0;
				for (int j = 0; j < viviendas.size(); j++) {
					if (viviendas.get(j).getIdDataVivienda() != 0) {
						viviendasSin.add(i, viviendas.get(j));
						i++;
					}

				}
				List<ViviendaVo> viviendasVo = new ArrayList<ViviendaVo>();

				viviendasSin.stream().forEach(viviendaB -> viviendasVo.add(new ViviendaVo(viviendaB)));
				viviendaBean.setViviendasVo(viviendasVo);
				storeOnSession("viviendaBean", viviendaBean);

			}

			if (viviendaBean.getViviendasVo().size() == 0) {
				addMessage(null, BaseHandler.getI18nMessage("mensaje-busqueda-vacia"), "");
			}

			try {
				long idCiudadano = (long) FacesContext.getCurrentInstance().getExternalContext().getSessionMap()
						.get(BaseHandler.LLAVE_SESSION_ID_CIUDADANO_CARACTERIZADO);

				String option = "buscar-vivienda";
				long idPrimary = idCiudadano;
				String action = "Buscar viviendas";
				JSONObject obj = new JSONObject();
				obj.put("Dirección", viviendaBean.getFiltroDireccion());
				obj.put("Techo", viviendaBean.getFiltroTecho());
				// obj.put("Viviendas", viviendasVo);

				// System.out.println("objeto json"+obj);

				String info = obj.toString();
				addAuditInfo(option, idPrimary, action, info);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

		} catch (Exception e) {
			govistaPrincipal();
			e.printStackTrace();
		}

	}
	/*
	 * public void onEncontrarCorregimiento() { try { if
	 * (viviendaBean.getId_conf_zona_ubicacion() != 0) {
	 * 
	 * 
	 * List<ConfComunaCorregimiento> comunas =
	 * ConfComunaCorregimientoLocalServiceUtil
	 * .findByIdConfZonaUbicacion(viviendaBean.getId_conf_zona_ubicacion());
	 * viviendaBean.setComuna(comunas);
	 * 
	 * // viviendaBean.set } } catch (Exception e) { govistaPrincipal();
	 * e.printStackTrace(); }
	 * 
	 * // cities = new HashMap<String, String>(); }
	 */

	/*
	 * public void onEncontrarCorregimiento() { try { if
	 * (viviendaBean.getId_conf_zona_ubicacion() != 0) {
	 * 
	 * 
	 * if(viviendaBean.getId_conf_zona_ubicacion()== 1){
	 * 
	 * List<ConfVeredaBarrioAhdi> listaComunaCorregimiento =
	 * ConfVeredaBarrioAhdiLocalServiceUtil.findByTipo(viviendaBean.
	 * CADENA_BD_TIPO_VEREDA); viviendaBean.setVereda(listaComunaCorregimiento);
	 * }
	 * 
	 * if(viviendaBean.getId_conf_zona_ubicacion()== 2){
	 * 
	 * List<ConfVeredaBarrioAhdi> listaComunaCorregimiento =
	 * ConfVeredaBarrioAhdiLocalServiceUtil.findByTipo(viviendaBean.
	 * CADENA_BD_TIPO_BARRIO); viviendaBean.setVereda(listaComunaCorregimiento);
	 * System.out.println(listaComunaCorregimiento); }
	 * 
	 * if(viviendaBean.getId_conf_zona_ubicacion()== 3){
	 * List<ConfVeredaBarrioAhdi> listaComunaCorregimiento =
	 * ConfVeredaBarrioAhdiLocalServiceUtil.findByTipo(viviendaBean.
	 * CADENA_BD_TIPO_ASENTAMIENTO_URBANA);
	 * viviendaBean.setVereda(listaComunaCorregimiento); }
	 * 
	 * if(viviendaBean.getId_conf_zona_ubicacion()== 4){
	 * List<ConfVeredaBarrioAhdi> listaComunaCorregimiento =
	 * ConfVeredaBarrioAhdiLocalServiceUtil.findByTipo(viviendaBean.
	 * CADENA_BD_TIPO_ASENTAMIENTO_RURAL);
	 * viviendaBean.setVereda(listaComunaCorregimiento); }
	 * 
	 * 
	 * 
	 * } } catch (Exception e) { govistaPrincipal(); e.printStackTrace(); }
	 * 
	 * // cities = new HashMap<String, String>(); }
	 * 
	 */

	public void onEncontrarCorregimiento() {
		try {

			if (viviendaBean.getId_conf_zona_ubicacion() != 0) {

				if (viviendaBean.getId_conf_zona_ubicacion() == 1) {

					List<ConfVeredaBarrioAhdi> listaComunaCorregimiento = ConfVeredaBarrioAhdiLocalServiceUtil
							.findByTipo(viviendaBean.CADENA_BD_TIPO_VEREDA);
					viviendaBean.setVereda(listaComunaCorregimiento);
				}

				else if (viviendaBean.getId_conf_zona_ubicacion() == 2) {

					List<ConfVeredaBarrioAhdi> listaComunaCorregimiento = ConfVeredaBarrioAhdiLocalServiceUtil
							.findByTipo(viviendaBean.CADENA_BD_TIPO_BARRIO);
					viviendaBean.setVereda(listaComunaCorregimiento);
					System.out.println(listaComunaCorregimiento);
				}

				else if (viviendaBean.getId_conf_zona_ubicacion() == 3) {
					List<ConfVeredaBarrioAhdi> listaComunaCorregimiento = ConfVeredaBarrioAhdiLocalServiceUtil
							.findByTipo(viviendaBean.CADENA_BD_TIPO_ASENTAMIENTO_URBANA);
					viviendaBean.setVereda(listaComunaCorregimiento);
				}

				else if (viviendaBean.getId_conf_zona_ubicacion() == 4) {
					List<ConfVeredaBarrioAhdi> listaComunaCorregimiento = ConfVeredaBarrioAhdiLocalServiceUtil
							.findByTipo(viviendaBean.CADENA_BD_TIPO_ASENTAMIENTO_RURAL);
					viviendaBean.setVereda(listaComunaCorregimiento);
				}

			}
		} catch (Exception e) {
			govistaPrincipal();
			e.printStackTrace();
		}

		// cities = new HashMap<String, String>();
	}

	public void onEncontrarBarrio() {
		try {
			if (viviendaBean.getId_conf_comuna_corregimiento() != 0) {

				List<ConfVeredaBarrioAhdi> barrios = ConfVeredaBarrioAhdiLocalServiceUtil
						.findByIdConfComunaCorregimiento(viviendaBean.getId_conf_comuna_corregimiento());

				viviendaBean.setVereda(barrios);
			}

		} catch (Exception e) {
			govistaPrincipal();
			e.printStackTrace();
		}
	}

	// metodo de prueba Flujo
	public String verCiudadanos() {
		try {
			if (viviendaBean == null) {
				viviendaBean = new ViviendaBean();
			}

			List<DataCiudadano> ciudadanos = DataCiudadanoLocalServiceUtil.getDataCiudadanos(QueryUtil.ALL_POS,
					QueryUtil.ALL_POS);

			viviendaBean.setCiudadanos(ciudadanos);
			storeOnSession("viviendaBean", viviendaBean);
		} catch (Exception e) {
			govistaPrincipal();
			e.printStackTrace();
		}
		return "listar_ciudadanos";
	}

	public String goHogaresVivienda() {
		try {
			if (Validator.isNotNull(viviendaBean.getCiudadano())) {
				List<HogaresVo> hogaresVo = new ArrayList<HogaresVo>();

				List<DataHogar> hogaresVivienda = DataHogarLocalServiceUtil
						.findByIdDataVivienda(viviendaBean.getId_data_vivienda());
				viviendaBean.setId_data_hogar_excluir(0);

				for (int i = 0; i < hogaresVivienda.size(); i++) {

					// relacion entre el hogar ciudadano
					DynamicQuery dqHogarCiudadanosJH = DynamicQueryFactoryUtil.forClass(DataHogarCiudadano.class);
					dqHogarCiudadanosJH
							.add(RestrictionsFactoryUtil.eq("idDataHogar", hogaresVivienda.get(i).getIdDataHogar()));
					dqHogarCiudadanosJH
							.add(RestrictionsFactoryUtil.eq("idConfParentesco", viviendaBean.ID_PARENTESCO_JEFE));
					List<DataHogarCiudadano> hogarCiudadanoJH;

					hogarCiudadanoJH = DataHogarCiudadanoLocalServiceUtil.dynamicQuery(dqHogarCiudadanosJH);

					System.out.println("lista hogarCiudadanoJH" + hogarCiudadanoJH);
					// me trae uno solo
					if (hogarCiudadanoJH.size() == 1) {

						DataCiudadano ciudadano = DataCiudadanoLocalServiceUtil
								.getDataCiudadano(hogarCiudadanoJH.get(0).getIdDataCiudadano());
						// hogarVo.setFicha(hogaresVivienda.get(i).getNumeroFicha();

						DataHogarCiudadano dtHogar = DataHogarCiudadanoLocalServiceUtil
								.getDataHogarCiudadano(ciudadano.getIdDataCiudadano());
						DataHogar hogar = DataHogarLocalServiceUtil.getDataHogar(dtHogar.getIdDataHogar());

						// hogarVo.setFicha(hogar.getNumeroFicha());
						ConfTipoDocumento tipoD = ConfTipoDocumentoLocalServiceUtil
								.getConfTipoDocumento(ciudadano.getIdConfTipoDocumento());
						HogaresVo hogarVo = new HogaresVo();
						hogarVo.setId_data_hogar(hogar.getIdDataHogar());
						hogarVo.setNombreTipoDocumentoJH(tipoD.getNombre());
						hogarVo.setNumeroIdentificacionJH(ciudadano.getNumeroIdentificacion());
						hogarVo.setNumero_ficha(hogar.getNumeroFicha());

						hogarVo.setPrimerNombreJH(ciudadano.getPrimerNombre());

						hogarVo.setSegundoNombreJH(ciudadano.getSegundoNombre());

						hogarVo.setPrimerApellidoJH(ciudadano.getPrimerApellido());
						hogarVo.setSegundoApellidoJH(ciudadano.getSegundoApellido());

						hogaresVo.add(hogarVo);

					}

				}
				viviendaBean.setHogaresVo(hogaresVo);
				// auditoria info
				long idCiudadano = (long) FacesContext.getCurrentInstance().getExternalContext().getSessionMap()
						.get(BaseHandler.LLAVE_SESSION_ID_CIUDADANO_CARACTERIZADO);

				String option = "hogares-de-vivienda";
				long idPrimary = idCiudadano;
				String action = "Listar hogares de la vivienda";
				JSONObject obj = new JSONObject();
				obj.put("Dirección", viviendaBean.getDireccion());
				obj.put("Hogares", hogaresVo);

				// System.out.println("objeto json"+obj);

				String info = obj.toString();
				addAuditInfo(option, idPrimary, action, info);
			}

		} catch (Exception e) {
			govistaPrincipal();
			e.printStackTrace();
		}
		return "hogares_vivienda";

	}

	public String goAdicionarHogar() throws SystemException {
		try {
			List<HogaresVo> hogaresVo = new ArrayList<HogaresVo>();
			viviendaBean.setHogaresVo(hogaresVo); // reinicio variable
			viviendaBean.setNumero_ficha("");
		} catch (Exception e) {
			govistaPrincipal();
			e.printStackTrace();
		}
		return "adicionar_hogar";

	}

	public void buscarHogares() throws SystemException {

		List<HogaresVo> hogaresVo = new ArrayList<HogaresVo>();

		if (viviendaBean.getNumero_ficha().trim().isEmpty() != true
				&& viviendaBean.getNumero_ficha().trim().equals("%") != true && viviendaBean.getNumero_ficha() != "") {

			List<DataHogarCiudadano> hogarCiudadanoJH = null;
			List<DataHogarCiudadano> hogarCiudadanos = new ArrayList<DataHogarCiudadano>();
			try {

				List<DataHogar> hogares = null;
				hogares = DataHogarLocalServiceUtil.findByNumeroFichaLike(viviendaBean.getNumero_ficha());

				for (int i = 0; i < hogares.size(); i++) {

					DynamicQuery dqHogarCiudadanosJH = DynamicQueryFactoryUtil.forClass(DataHogarCiudadano.class);
					dqHogarCiudadanosJH.add(RestrictionsFactoryUtil.eq("idDataHogar", hogares.get(i).getIdDataHogar()));
					dqHogarCiudadanosJH
							.add(RestrictionsFactoryUtil.eq("idConfParentesco", viviendaBean.ID_PARENTESCO_JEFE));

					hogarCiudadanoJH = DataHogarCiudadanoLocalServiceUtil.dynamicQuery(dqHogarCiudadanosJH);
					if (hogarCiudadanoJH.size() != 0) {
						hogarCiudadanos.add(hogarCiudadanoJH.get(0));
					}
				}

				if (hogarCiudadanos.size() != 0) {

					for (int i = 0; i < hogarCiudadanos.size(); i++) {

						DataCiudadano ciudadano = DataCiudadanoLocalServiceUtil
								.getDataCiudadano(hogarCiudadanos.get(i).getIdDataCiudadano());
						DataHogarCiudadano dtHogar = DataHogarCiudadanoLocalServiceUtil
								.getDataHogarCiudadano(ciudadano.getIdDataCiudadano());

						DataHogar hogar = DataHogarLocalServiceUtil.getDataHogar(dtHogar.getIdDataHogar());

						ConfTipoDocumento tipoD = ConfTipoDocumentoLocalServiceUtil
								.getConfTipoDocumento(ciudadano.getIdConfTipoDocumento());
						HogaresVo hogarVo = new HogaresVo();
						hogarVo.setId_data_hogar(dtHogar.getIdDataHogar());
						hogarVo.setNombreTipoDocumentoJH(tipoD.getNombre());
						hogarVo.setNumeroIdentificacionJH(ciudadano.getNumeroIdentificacion());
						hogarVo.setNumero_ficha(hogar.getNumeroFicha());

						hogarVo.setPrimerNombreJH(ciudadano.getPrimerNombre());

						hogarVo.setSegundoNombreJH(ciudadano.getSegundoNombre());

						hogarVo.setPrimerApellidoJH(ciudadano.getPrimerApellido());
						hogarVo.setSegundoApellidoJH(ciudadano.getSegundoApellido());

						hogaresVo.add(hogarVo);

					}
				}

				viviendaBean.setHogaresVo(hogaresVo);
				if (hogaresVo.size() == 0) {
					addMessage(null, getI18nMessage("mensaje-busqueda-vacia"), "");
				}
			} catch (Exception e) {
				govistaPrincipal();
				e.printStackTrace();
			}
		} else {

			viviendaBean.setHogaresVo(hogaresVo);
			if (hogaresVo.size() == 0) {
				addMessage(null, getI18nMessage("mensaje-busqueda-vacia"), "");
			}
		}

		long idCiudadano = (long) FacesContext.getCurrentInstance().getExternalContext().getSessionMap()
				.get(BaseHandler.LLAVE_SESSION_ID_CIUDADANO_CARACTERIZADO);

		String option = "adicionar-hogar";
		long idPrimary = idCiudadano;
		String action = "Buscar hogares";
		JSONObject obj = new JSONObject();
		obj.put("Numero ficha", viviendaBean.getNumero_ficha());
		// obj.put("Hogar", hogaresVo);

		// System.out.println("objeto json"+obj);

		String info = obj.toString();
		addAuditInfo(option, idPrimary, action, info);

	}

	public String desicionCancelar() {
		String retornar = "";
		try {
			capturarCiudadano();
			if (viviendaBean.getId_data_hogar_asociar() == 0) {
				viviendaBean.setId_data_vivienda(0);
				retornar = goBuscarVivienda();

			} else {
				List<DataHogarCiudadano> hogarAsociado;
				hogarAsociado = DataHogarCiudadanoLocalServiceUtil
						.findByIdDataHogar(viviendaBean.getId_data_hogar_asociar());
				DataHogar tieneVivienda = DataHogarLocalServiceUtil
						.getDataHogar(viviendaBean.getId_data_hogar_asociar());
				if (tieneVivienda.getIdDataVivienda() == 0) {

					retornar = goAdicionarHogar();

				}

			}

		} catch (Exception e) {
			govistaPrincipal();
			e.printStackTrace();
		}
		return retornar;

	}

	public String desicionAsociar() {

		String retorno = "";
		try {
			capturarCiudadano();
			if (viviendaBean.getId_data_hogar_asociar() == 0) {

				viviendaBean.setId_data_vivienda(0);
				retorno = goAsociarViviendaSeleccionada();

			}

			else {
				List<DataHogarCiudadano> hogarAsociado;
				hogarAsociado = DataHogarCiudadanoLocalServiceUtil
						.findByIdDataHogar(viviendaBean.getId_data_hogar_asociar());
				DataHogar tieneVivienda = DataHogarLocalServiceUtil
						.getDataHogar(viviendaBean.getId_data_hogar_asociar());
				if (tieneVivienda.getIdDataVivienda() == 0) {

					retorno = goAsociarVivienda();

				}

				else {
					// if(hogarAsociado.get(0).getIdDataCiudadano() !=
					// viviendaBean.getCiudadano().getIdDataCiudadano()){
					DynamicQuery dqHogarVivienda = DynamicQueryFactoryUtil.forClass(DataHogar.class);
					dqHogarVivienda
							.add(RestrictionsFactoryUtil.eq("idDataHogar", viviendaBean.getId_data_hogar_asociar()));
					dqHogarVivienda
							.add(RestrictionsFactoryUtil.eq("idDataVivienda", viviendaBean.getId_data_vivienda()));
					List<DataHogar> estaviviendaHogar;

					estaviviendaHogar = DataHogarLocalServiceUtil.dynamicQuery(dqHogarVivienda);

					if (estaviviendaHogar.size() != 0) {
						addMessage(null, getI18nMessage("hogar-ya-asociada"), "");
						return goHogaresVivienda();
					}

					return "m-asociar";

				}
			}

		} catch (Exception e) {
			String errorMsg = BaseHandler.getI18nMessage("error-base-datos");
			BaseHandler.addError(FacesContext.getCurrentInstance(), null, errorMsg,
					errorMsg + "(" + e.getMessage() + ")");
			goHogaresVivienda();
			e.printStackTrace();
		}

		return retorno;
	}

	public String govistaPrincipal() {
		try {
			FacesContext.getCurrentInstance().getExternalContext()
					.redirect("/views/portlet/datos_ciudadano/buscar-ciudadano.xhtml");
		} catch (Exception e) {
			String error = getI18nMessage("error-sistema");
			this.addError(null, "", error + "(" + e.getMessage() + ")");
			e.printStackTrace();

		}
		return "null";

	}

	public String goAsociarVivienda() throws PortalException, SystemException {
		try {
			capturarCiudadano();
			viviendaBean.setId_data_vivienda_seleccionada(0);
			if (Validator.isNotNull(viviendaBean.getId_data_vivienda())) {

				DataHogar hogarAsociar = DataHogarLocalServiceUtil
						.getDataHogar(viviendaBean.getId_data_hogar_asociar());
				// DataVivienda viviendaDiferente =
				// DataViviendaLocalServiceUtil(hogarAsociar.getIdDataVivienda());
				DataVivienda direccionHogar;

				// if(hogarAsociar.getIdDataVivienda()== 0 ){

				direccionHogar = DataViviendaLocalServiceUtil.getDataVivienda(viviendaBean.getId_data_vivienda());
				viviendaBean.setDireccion(direccionHogar.getDireccion());
				// viviendaBean.setHogar(hogar);

				// DataHogar hogar =
				// DataHogarLocalServiceUtil.getDataHogar(dtHogar.getIdDataHogar());

				// viviendaBean.setNumero_ficha(hogar.getNumeroFicha());

				DynamicQuery dqHogarCiudadanosJH = DynamicQueryFactoryUtil.forClass(DataHogarCiudadano.class);
				dqHogarCiudadanosJH.add(RestrictionsFactoryUtil.eq("idDataHogar", hogarAsociar.getIdDataHogar()));
				dqHogarCiudadanosJH
						.add(RestrictionsFactoryUtil.eq("idConfParentesco", viviendaBean.ID_PARENTESCO_JEFE));
				List<DataHogarCiudadano> hogarCiudadanoJH = null;

				hogarCiudadanoJH = DataHogarCiudadanoLocalServiceUtil.dynamicQuery(dqHogarCiudadanosJH);

				DataCiudadano ciudadanoJH = null;
				if (hogarCiudadanoJH.size() != 0) {
					ciudadanoJH = DataCiudadanoLocalServiceUtil
							.getDataCiudadano(hogarCiudadanoJH.get(0).getIdDataCiudadano());
				}

				ConfTipoDocumento documento = ConfTipoDocumentoLocalServiceUtil
						.getConfTipoDocumento(ciudadanoJH.getIdConfTipoDocumento());

				viviendaBean.setTipo_identificacion(documento.getNombre());

				viviendaBean.setCiudadanoJH(ciudadanoJH);
				viviendaBean.setNumero_ficha(hogarAsociar.getNumeroFicha());
				// auditoria info
				String option = "asociar-hogar";
				long idPrimary = viviendaBean.getId_data_ciudadano();
				String action = "Ver asociar hogar a vivienda";
				JSONObject obj = new JSONObject();
				obj.put("Ficha hogar", viviendaBean.getNumero_ficha());
				obj.put("Dirección", viviendaBean.getDireccion());

				obj.put("Tipo identificacion jefe de hogar", viviendaBean.getTipo_identificacion());
				obj.put("Numero identificacion jefe de hogar", ciudadanoJH.getNumeroIdentificacion());
				obj.put("Primer nombre jefe hogar", ciudadanoJH.getPrimerNombre());
				obj.put("Segundo nombre jefe hogar", ciudadanoJH.getSegundoNombre());
				obj.put("Primer Apellido", ciudadanoJH.getPrimerApellido());
				obj.put("Segundo Apellido", ciudadanoJH.getSegundoApellido());
				// System.out.println("objeto json"+obj);

				String info = obj.toString();
				addAuditInfo(option, idPrimary, action, info);

			}
		} catch (Exception e) {
			govistaPrincipal();
			e.printStackTrace();
		}
		/*
		 * else {
		 * viviendaBean.setId_data_hogar_excluir(hogarAsociar.getIdDataHogar());
		 * excluirPrimero();
		 * 
		 * }
		 */
		storeOnSession("viviendaBean", viviendaBean);
		return "asociar_vivienda";
	}

	public String goAsociarViviendaSeleccionada() throws PortalException, SystemException {
		try {
			capturarCiudadano();
			viviendaBean.setId_data_vivienda(0);
			if (Validator.isNotNull(viviendaBean.getId_data_vivienda_seleccionada())) {

				DataHogar hogarAsociar = DataHogarLocalServiceUtil.getDataHogar(viviendaBean.getId_data_hogar());

				DataVivienda direccionHogar;

				direccionHogar = DataViviendaLocalServiceUtil
						.getDataVivienda(viviendaBean.getId_data_vivienda_seleccionada());
				viviendaBean.setDireccion(direccionHogar.getDireccion());

				DynamicQuery dqHogarCiudadanosJH = DynamicQueryFactoryUtil.forClass(DataHogarCiudadano.class);
				dqHogarCiudadanosJH.add(RestrictionsFactoryUtil.eq("idDataHogar", hogarAsociar.getIdDataHogar()));
				dqHogarCiudadanosJH
						.add(RestrictionsFactoryUtil.eq("idConfParentesco", viviendaBean.ID_PARENTESCO_JEFE));
				List<DataHogarCiudadano> hogarCiudadanoJH = null;
				try {
					hogarCiudadanoJH = DataHogarCiudadanoLocalServiceUtil.dynamicQuery(dqHogarCiudadanosJH);
				} catch (Exception e) {
					String error = getI18nMessage("error-sistema");
					this.addError(null, "", error + "(" + e.getMessage() + ")");
					e.printStackTrace();
				}
				DataCiudadano ciudadanoJH = null;
				if (hogarCiudadanoJH.size() != 0) {
					ciudadanoJH = DataCiudadanoLocalServiceUtil
							.getDataCiudadano(hogarCiudadanoJH.get(0).getIdDataCiudadano());
				}

				ConfTipoDocumento documento = ConfTipoDocumentoLocalServiceUtil
						.getConfTipoDocumento(ciudadanoJH.getIdConfTipoDocumento());

				viviendaBean.setTipo_identificacion(documento.getNombre());

				viviendaBean.setCiudadanoJH(ciudadanoJH);
				viviendaBean.setNumero_ficha(hogarAsociar.getNumeroFicha());

				// auditoria info
				String option = "asociar-hogar";
				long idPrimary = viviendaBean.getId_data_ciudadano();
				String action = "Ver asociar hogar a vivienda";
				JSONObject obj = new JSONObject();
				obj.put("Ficha hogar", viviendaBean.getNumero_ficha());
				obj.put("Dirección", viviendaBean.getDireccion());

				obj.put("Tipo identificacion jefe de hogar", viviendaBean.getTipo_identificacion());
				obj.put("Numero identificacion jefe de hogar", ciudadanoJH.getNumeroIdentificacion());
				obj.put("Primer nombre jefe hogar", ciudadanoJH.getPrimerNombre());
				obj.put("Segundo nombre jefe hogar", ciudadanoJH.getSegundoNombre());
				obj.put("Primer Apellido", ciudadanoJH.getPrimerApellido());
				obj.put("Segundo Apellido", ciudadanoJH.getSegundoApellido());
				// System.out.println("objeto json"+obj);

				String info = obj.toString();
				addAuditInfo(option, idPrimary, action, info);

			}

			storeOnSession("viviendaBean", viviendaBean);
		} catch (Exception e) {
			govistaPrincipal();
			e.printStackTrace();
		}
		return "asociar_vivienda";
	}

	public String desicionAsociarBd() throws PortalException, SystemException {
		String retorno = "";
		if (viviendaBean.getId_data_vivienda() == 0 && viviendaBean.getId_data_vivienda_seleccionada() != 0) {
			retorno = asociarHogarViviendaSeleccionada();
		} else if (viviendaBean.getId_data_vivienda() != 0 && viviendaBean.getId_data_vivienda_seleccionada() == 0) {
			retorno = asociarHogar();
		}

		return retorno;

	}

	public String asociarHogarViviendaSeleccionada() throws PortalException, SystemException {
		try {
			capturarCiudadano();
			if (Validator.isNotNull(viviendaBean.getId_data_ciudadano())) {
				if (Validator.isNotNull(viviendaBean.getId_data_vivienda_seleccionada())) {

					DataHogar updatedHogar = DataHogarLocalServiceUtil.getDataHogar(viviendaBean.getId_data_hogar());

					updatedHogar.setIdDataVivienda(viviendaBean.getId_data_vivienda_seleccionada());

					DataHogarLocalServiceUtil.updateDataHogar(updatedHogar);

					addMessage(null, getI18nMessage("Hogar-asociado"), "");

					viviendaBean.setId_data_vivienda(viviendaBean.getId_data_vivienda_seleccionada());

				}
			}
			storeOnSession("viviendaBean", viviendaBean);
		} catch (Exception e) {
			govistaPrincipal();
			e.printStackTrace();
		}
		return goVerVivienda();
	}

	public String asociarHogar() throws PortalException, SystemException {
		try {
			capturarCiudadano();
			if (Validator.isNotNull(viviendaBean.getId_data_ciudadano())) {

				if (viviendaBean.getId_data_vivienda() != 0) {

					DataHogar updatedHogar = DataHogarLocalServiceUtil
							.getDataHogar(viviendaBean.getId_data_hogar_asociar());

					updatedHogar.setIdDataVivienda(viviendaBean.getId_data_vivienda());
					updatedHogar.setIp(getLoginUserIp());
					updatedHogar.setUserId(getUserId());
					java.util.Date utilDate = new java.util.Date();
					java.sql.Timestamp sqlTimestamp = new java.sql.Timestamp(utilDate.getTime());

					updatedHogar.setUpdatedAt(sqlTimestamp);

					DataHogarLocalServiceUtil.updateDataHogar(updatedHogar);

					addMessage(null, getI18nMessage("Hogar-asociado"), "");

					viviendaBean.setId_data_vivienda(viviendaBean.getId_data_vivienda());

				}
			}
			storeOnSession("viviendaBean", viviendaBean);
		} catch (Exception e) {
			govistaPrincipal();
			e.printStackTrace();
		}
		return goVerVivienda();

	}

	public String goexcluirHogar() throws PortalException, SystemException {

		try {

			capturarCiudadano();

			if (viviendaBean.getId_data_hogar_excluir() == 0) {
				viviendaBean.setId_data_hogar_excluir(viviendaBean.getId_data_hogar());
			}

			DataVivienda direccionHogar;

			direccionHogar = DataViviendaLocalServiceUtil.getDataVivienda(viviendaBean.getId_data_vivienda());
			viviendaBean.setDireccion(direccionHogar.getDireccion());
			DataHogar hogarExcluir = null;

			hogarExcluir = DataHogarLocalServiceUtil.getDataHogar(viviendaBean.getId_data_hogar_excluir());

			// viviendaBean.setHogar(hogar);

			// DataHogar hogar =
			// DataHogarLocalServiceUtil.getDataHogar(dtHogar.getIdDataHogar());

			// viviendaBean.setNumero_ficha(hogar.getNumeroFicha());

			DynamicQuery dqHogarCiudadanosJH = DynamicQueryFactoryUtil.forClass(DataHogarCiudadano.class);
			dqHogarCiudadanosJH.add(RestrictionsFactoryUtil.eq("idDataHogar", hogarExcluir.getIdDataHogar()));
			dqHogarCiudadanosJH.add(RestrictionsFactoryUtil.eq("idConfParentesco", viviendaBean.ID_PARENTESCO_JEFE));
			List<DataHogarCiudadano> hogarCiudadanoJH = null;

			hogarCiudadanoJH = DataHogarCiudadanoLocalServiceUtil.dynamicQuery(dqHogarCiudadanosJH);

			DataCiudadano ciudadanoJH = null;

			if (hogarCiudadanoJH.size() != 0) {
				ciudadanoJH = DataCiudadanoLocalServiceUtil
						.getDataCiudadano(hogarCiudadanoJH.get(0).getIdDataCiudadano());
			}

			ConfTipoDocumento documento = ConfTipoDocumentoLocalServiceUtil
					.getConfTipoDocumento(ciudadanoJH.getIdConfTipoDocumento());

			viviendaBean.setTipo_identificacion(documento.getNombre());

			viviendaBean.setCiudadanoJH(ciudadanoJH);
			viviendaBean.setNumero_ficha(hogarExcluir.getNumeroFicha());

			storeOnSession("viviendaBean", viviendaBean);

		} catch (Exception e) {
			govistaPrincipal();
			e.printStackTrace();
		}
		return "excluir-hogar";
	}

	public String excluirHogar() throws SystemException, PortalException {
		List<DataHogarCiudadano> ciudadanoExlcuido;
		capturarCiudadano();
		ciudadanoExlcuido = DataHogarCiudadanoLocalServiceUtil
				.findByIdDataHogar(viviendaBean.getId_data_hogar_excluir());
		System.out.println(ciudadanoExlcuido);
		System.out.println(viviendaBean.getCiudadano().getIdDataCiudadano());
		try {
			for (int j = 0; j < ciudadanoExlcuido.size(); j++) {
				System.out.println("Ciudadano: " + ciudadanoExlcuido.get(j).getIdDataCiudadano());
				if (ciudadanoExlcuido.get(j).getIdDataCiudadano() == viviendaBean.getCiudadano().getIdDataCiudadano()) {
					System.out.println("Dentro del if:" + ciudadanoExlcuido.get(j).getIdDataCiudadano());
					DataHogar updatedHogar = DataHogarLocalServiceUtil
							.getDataHogar(viviendaBean.getId_data_hogar_excluir());

					updatedHogar.setIdDataVivienda(0);
					updatedHogar.setIp(getLoginUserIp());
					updatedHogar.setUserId(getUserId());
					java.util.Date utilDate = new java.util.Date();
					java.sql.Timestamp sqlTimestamp = new java.sql.Timestamp(utilDate.getTime());

					updatedHogar.setUpdatedAt(sqlTimestamp);

					DataHogarLocalServiceUtil.updateDataHogar(updatedHogar);

					addMessage(null, getI18nMessage("Hogar-excluido"), "");

					try {
						FacesContext.getCurrentInstance().getExternalContext()
								.redirect("/views/portlet/encabezados/view.xhtml");
					} catch (Exception e) {
						govistaPrincipal();
						e.printStackTrace();
					}

				}
			}

			return excluirM();

		} catch (Exception e) {
			govistaPrincipal();
			e.printStackTrace();
		}

		return "null";

	}

	public String excluirM() throws PortalException, SystemException {

		return "m-excluir";
	}

	public void hogarCaracterizacion() {
		try {
			FacesContext.getCurrentInstance().getExternalContext().getSessionMap()
					.put(BaseHandler.LLAVE_SESSION_ID_HOGAR_SELECCIONADO, viviendaBean.getId_data_hogar());

			FacesContext.getCurrentInstance().getExternalContext().redirect("/views/portlet/hogar/datosHogar.xhtml");
		} catch (Exception e) {
			govistaPrincipal();
			e.printStackTrace();
		}
	}

	public void nuevoHogar() {
		try {

			FacesContext.getCurrentInstance().getExternalContext().redirect("/views/portlet/hogar/nuevoHogar.xhtml");
		} catch (Exception e) {
			govistaPrincipal();
			e.printStackTrace();
		}
	}

//	public void goOrganizaciones() throws PortalException, SystemException, IOException {
//		try {
//			storeOnSession("viviendaBean", viviendaBean);
//
//			FacesContext.getCurrentInstance().getExternalContext()
//					.redirect("/views/portlet/viviendaCiudadano/buscar-viviendaCiudadano.xhtml");
//		} catch (Exception e) {
//			govistaPrincipal();
//			e.printStackTrace();
//		}
//	}
	
	public void goUnidadesProductivas() throws PortalException, SystemException, IOException {
		try {
			storeOnSession("unidadesProductivasBean", unidadProductivaBean);

			FacesContext.getCurrentInstance().getExternalContext()
					.redirect("/views/portlet/unidadesProductivas/view.xhtml");
		} catch (Exception e) {
			govistaPrincipal();
			e.printStackTrace();
		}
	}
	

	public java.util.List<String> completePoseedor(String query) {
		java.util.List<String> results = new ArrayList<String>();
		List<DataCiudadano> listasProve = null;
		viviendaBean.setNombre_poseedor(null);
		try {
			listasProve = DataCiudadanoLocalServiceUtil.findByTipoIdentificacionNumeroIdentificacion(0L,
					Long.parseLong(query), QueryUtil.ALL_POS, QueryUtil.ALL_POS);
			// listasProve = DataCiudadanoLocalServiceUtil.findByAll(0L, 0L,
			// Long.valueOf(query) ,null, null, null, null, null,
			// QueryUtil.ALL_POS, QueryUtil.ALL_POS);
			// listasProve =
			// DataCiudadanoLocalServiceUtil.findByNumeroIdentificacion(Long.valueOf(query));
		} catch (Exception e) {
			BaseHandler.addError(FacesContext.getCurrentInstance(), null, "",
					BaseHandler.getI18nMessage("error-base-datos") + "(" + e.getMessage() + ")");
			e.printStackTrace();
		}
		for (DataCiudadano data : listasProve) {
			results.add(data.getNumeroIdentificacion() + "");
		}

		return results;
	}

	public String findDatosPoseedor() {
		List<DataCiudadano> ciuEl = null;
		if (viviendaBean.getCedula_poseedor() != null && viviendaBean.getCedula_poseedor() != "") {
			try {
				ciuEl = DataCiudadanoLocalServiceUtil
						.findByNumeroIdentificacion(Long.valueOf(viviendaBean.getCedula_poseedor()));

				viviendaBean.setNombre_poseedor(ciuEl.get(0).getPrimerNombre() + " " + ciuEl.get(0).getSegundoNombre()
						+ " " + ciuEl.get(0).getPrimerApellido() + " " + ciuEl.get(0).getSegundoApellido());

			} catch (Exception e) {
				BaseHandler.addError(FacesContext.getCurrentInstance(), null, "",
						BaseHandler.getI18nMessage("error-base-datos") + "(" + e.getMessage() + ")");
				e.printStackTrace();
			}
		}

		return "null";

	}

	public void verCanon() {

		if (viviendaBean.getId_conf_condicion_vivienda() == 1) {

			viviendaBean.setVisibilidadCanon(viviendaBean.STYLE_VISIBLE);

		} else {
			viviendaBean.setVisibilidadCanon(viviendaBean.STYLE_INVISIBLE);

		}

	}
	
	public void ocultarDireccionVivienda(){
		 if(viviendaBean.getTipoDireccion().equals("Si")){
			 RequestContext.getCurrentInstance().execute("mostrarVivienda()");
		 }else{
			 RequestContext.getCurrentInstance().execute("ocultarVivienda()");
		 }		 
	 }

	public UnidadProductivaBean getUnidadProductivaBean() {
		return unidadProductivaBean;
	}

	public void setUnidadProductivaBean(UnidadProductivaBean unidadProductivaBean) {
		this.unidadProductivaBean = unidadProductivaBean;
	}
	
	
	
}
