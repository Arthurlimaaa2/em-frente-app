package br.com.cartoesenfrentamento.app;
import android.app.PendingIntent;
import android.appwidget.*;
import android.content.*;
import android.widget.RemoteViews;
import java.text.SimpleDateFormat;
import java.util.*;

public class EmFrenteWidget extends AppWidgetProvider {
  static SimpleDateFormat format() { SimpleDateFormat f=new SimpleDateFormat("yyyy-MM-dd",Locale.US); f.setLenient(false); return f; }
  static boolean validDate(String start) {
    try { return start.matches("[0-9]{4}-[0-9]{2}-[0-9]{2}") && format().format(format().parse(start)).equals(start) && start.compareTo(format().format(new Date()))<=0; }
    catch(Exception e) { return false; }
  }
  static long days(String start) {
    try {
      SimpleDateFormat f=format(); f.setTimeZone(TimeZone.getTimeZone("UTC"));
      return Math.max(0,(f.parse(format().format(new Date())).getTime()-f.parse(start).getTime())/86400000L);
    } catch(Exception e) { return 0; }
  }
  static void refresh(Context context) {
    AppWidgetManager manager=AppWidgetManager.getInstance(context);
    for(Class<?> cls:new Class<?>[]{QuickWidget.class,CounterWidget.class})
      for(int id:manager.getAppWidgetIds(new ComponentName(context,cls))) render(context,manager,id,cls==QuickWidget.class);
  }
  static void render(Context context,AppWidgetManager manager,int id,boolean quick) {
    RemoteViews view=new RemoteViews(context.getPackageName(),quick?R.layout.widget_quick:R.layout.widget_counter);
    Intent intent=new Intent(context,MainActivity.class).setAction(quick?"emfrente.REFLECT":"emfrente.COUNTER");
    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK|Intent.FLAG_ACTIVITY_CLEAR_TOP);
    intent.putExtra("widgetPath",quick?"/criar/enfrentamento":"/");
    view.setOnClickPendingIntent(R.id.widget_root,PendingIntent.getActivity(context,quick?10:20,intent,PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE));
    if(!quick) {
      android.content.SharedPreferences p=context.getSharedPreferences("day_counter",0);
      String start=p.getString("start","");
      view.setTextViewText(R.id.counter_title,p.getString("name","Escolha seu marco"));
      view.setTextViewText(R.id.counter_value,start.isEmpty()?"—":String.valueOf(days(start)));
      view.setTextViewText(R.id.counter_unit,start.isEmpty()?"Toque para configurar":"dias");
    }
    manager.updateAppWidget(id,view);
  }
  @Override public void onUpdate(Context c,AppWidgetManager m,int[] ids) { for(int id:ids) render(c,m,id,this instanceof QuickWidget); }
  @Override public void onReceive(Context c,Intent i) { super.onReceive(c,i); refresh(c); }
}

