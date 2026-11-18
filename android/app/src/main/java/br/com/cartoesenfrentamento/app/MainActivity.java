package br.com.cartoesenfrentamento.app;

import android.os.Bundle;
import android.graphics.Color;

import com.getcapacitor.BridgeActivity;
import androidx.core.view.WindowInsetsControllerCompat;

public class MainActivity extends BridgeActivity {
    private boolean widgetNavigationReady = false;
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(EmFrenteWidgetsPlugin.class);
        super.onCreate(savedInstanceState);
        widgetNavigationReady = true;
        getWindow().setStatusBarColor(Color.rgb(251, 249, 247));
        getWindow().setNavigationBarColor(Color.rgb(251, 249, 247));
        WindowInsetsControllerCompat insets = new WindowInsetsControllerCompat(getWindow(), getWindow().getDecorView());
        insets.setAppearanceLightStatusBars(true);
        insets.setAppearanceLightNavigationBars(true);
        getWindow().getDecorView().post(() -> {
            WindowInsetsControllerCompat delayedInsets = new WindowInsetsControllerCompat(getWindow(), getWindow().getDecorView());
            delayedInsets.setAppearanceLightStatusBars(true);
            delayedInsets.setAppearanceLightNavigationBars(true);
        });
    }
    @Override
    protected void onNewIntent(android.content.Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        if (widgetNavigationReady && intent.hasExtra("widgetPath") && getBridge() != null) {
            getBridge().getWebView().post(() -> getBridge().getWebView().evaluateJavascript(
                "window.dispatchEvent(new Event('emfrente:widget-navigation'));", null));
        }
    }
}
