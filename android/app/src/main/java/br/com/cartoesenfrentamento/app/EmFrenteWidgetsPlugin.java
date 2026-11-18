package br.com.cartoesenfrentamento.app;
import com.getcapacitor.*;
import com.getcapacitor.annotation.CapacitorPlugin;
import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.os.Build;
import android.graphics.Color;
import android.view.Window;
import androidx.core.view.WindowInsetsControllerCompat;
@CapacitorPlugin(name="EmFrenteWidgets")
public class EmFrenteWidgetsPlugin extends Plugin {
  @PluginMethod public void clearCounter(PluginCall call) {
    if (!getContext().getSharedPreferences("day_counter",0).edit().clear().commit()) {
      call.reject("Falha ao apagar."); return;
    }
    EmFrenteWidget.refresh(getContext()); call.resolve();
  }
  @PluginMethod public void getCounter(PluginCall call) {
    android.content.SharedPreferences p = getContext().getSharedPreferences("day_counter",0);
    JSObject result = new JSObject();
    result.put("name",p.getString("name","")); result.put("start",p.getString("start","")); call.resolve(result);
  }
  @PluginMethod public void setCounter(PluginCall call) {
    String name=call.getString("name","").trim(), start=call.getString("start","");
    if(name.isEmpty() || name.length()>60 || !EmFrenteWidget.validDate(start)) {
      call.reject("Nome ou data inválidos."); return;
    }
    boolean saved=getContext().getSharedPreferences("day_counter",0).edit().putString("name",name).putString("start",start).commit();
    if(!saved) { call.reject("Falha ao salvar."); return; }
    EmFrenteWidget.refresh(getContext()); call.resolve();
  }
  @PluginMethod public void getLaunchPath(PluginCall call) {
    String path=getActivity().getIntent().getStringExtra("widgetPath");
    getActivity().getIntent().removeExtra("widgetPath");
    JSObject result=new JSObject(); result.put("path","/criar/enfrentamento".equals(path)?path:"/"); call.resolve(result);
  }
  @PluginMethod public void setAppearance(PluginCall call) {
    String appearance=call.getString("appearance","light");
    boolean dark="dark".equals(appearance);
    int surface=dark?Color.rgb(22,22,30):("colorblind".equals(appearance)?Color.rgb(247,251,254):Color.rgb(251,249,247));
    getActivity().runOnUiThread(() -> {
      Window window=getActivity().getWindow();
      window.setStatusBarColor(surface); window.setNavigationBarColor(surface);
      WindowInsetsControllerCompat insets=new WindowInsetsControllerCompat(window,window.getDecorView());
      insets.setAppearanceLightStatusBars(!dark); insets.setAppearanceLightNavigationBars(!dark);
      call.resolve();
    });
  }
  @PluginMethod public void pin(PluginCall call) {
    getActivity().runOnUiThread(() -> {
      AppWidgetManager manager=AppWidgetManager.getInstance(getContext());
      boolean supported=Build.VERSION.SDK_INT>=26 && manager.isRequestPinAppWidgetSupported();
      if(supported) manager.requestPinAppWidget(new ComponentName(getContext(),
        "counter".equals(call.getString("kind"))?CounterWidget.class:QuickWidget.class),null,null);
      JSObject result=new JSObject(); result.put("supported",supported); call.resolve(result);
    });
  }
}

