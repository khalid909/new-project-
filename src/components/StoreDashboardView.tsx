// ─── ALGERIA 69 WILAYAS SHIPPING MANAGEMENT STATE ───
  const [wilayasList, setWilayasList] = useState<WilayaShippingRate[]>(() => {
    if (typeof window === 'undefined') return DEFAULT_WILAYAS_69;
    try {
      const saved = localStorage.getItem(`wasladz_shipping_wilayas_${store.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_WILAYAS_69;
  });

  const [shippingSearchQuery, setShippingSearchQuery] = useState('');
  const [editingWilayaCode, setEditingWilayaCode] = useState<string | null>(null);
  const [editDeskPrice, setEditDeskPrice] = useState<number>(0);
  const [editHomePrice, setEditHomePrice] = useState<number>(0);

  // حفظ التعديلات في LocalStorage
  const handleSaveWilayasChanges = (updatedList: WilayaShippingRate[]) => {
    setWilayasList(updatedList);
    try {
      localStorage.setItem(`wasladz_shipping_wilayas_${store.id}`, JSON.stringify(updatedList));
      showToast(isAr ? 'تم حفظ أسعار الشحن وتحديث الـ 69 ولاية بنجاح! 🚚' : 'Shipping rates updated successfully!');
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateWilayaPrices = (code: string) => {
    const updated = wilayasList.map((w) => {
      if (w.code === code) {
        return { ...w, deskPrice: Number(editDeskPrice), homePrice: Number(editHomePrice) };
      }
      return w;
    });
    handleSaveWilayasChanges(updated);
    setEditingWilayaCode(null);
    showToast(isAr ? 'تم تحديث أسعار الولاية بنجاح' : 'Wilaya prices updated');
  };

  const handleDeleteWilaya = (code: string) => {
    const updated = wilayasList.map((w) => {
      if (w.code === code) {
        return { ...w, isDeleted: true };
      }
      return w;
    });
    handleSaveWilayasChanges(updated);
  };

  const handleToggleWilayaStatus = (code: string) => {
    const updated = wilayasList.map((w) => {
      if (w.code === code) {
        return { ...w, isEnabled: !w.isEnabled };
      }
      return w;
    });
    handleSaveWilayasChanges(updated);
  };