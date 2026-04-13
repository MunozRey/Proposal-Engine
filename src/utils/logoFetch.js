export function fetchLogoFromDomain(domain, target, dispatch, setStatus, setLoading) {
  const clean = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();
  if (!clean) { setStatus({ msg: 'Enter a domain', ok: false }); return () => {}; }
  setLoading(true);
  setStatus(null);

  let cancelled = false;

  const sources = [
    `https://logo.clearbit.com/${clean}`,
    `https://img.logo.dev/${clean}?token=pk_a8JbONNxTc2IOqAPKenfew&size=200&format=png`,
    `https://www.google.com/s2/favicons?domain=${clean}&sz=128`,
  ];

  function trySource(idx) {
    if (cancelled) return;
    if (idx >= sources.length) {
      if (!cancelled) {
        setLoading(false);
        setStatus({ msg: 'Logo not found. Please upload it manually.', ok: false });
      }
      return;
    }
    const url = sources[idx];

    // First try with CORS (allows canvas export as data URL)
    const imgCors = new Image();
    imgCors.crossOrigin = 'anonymous';
    imgCors.onload = () => {
      if (cancelled) return;
      try {
        const c = document.createElement('canvas');
        c.width = imgCors.naturalWidth;
        c.height = imgCors.naturalHeight;
        c.getContext('2d').drawImage(imgCors, 0, 0);
        dispatch({ t: 'SET', k: target, v: c.toDataURL('image/png') });
        setStatus({ msg: 'Logo loaded', ok: true });
      } catch {
        dispatch({ t: 'SET', k: target, v: url });
        setStatus({ msg: 'Logo loaded (external URL)', ok: true });
      }
      setLoading(false);
    };
    imgCors.onerror = () => {
      if (cancelled) return;
      // CORS failed — retry without crossOrigin (image loads but stays as external URL)
      const imgNoCors = new Image();
      imgNoCors.onload = () => {
        if (cancelled) return;
        dispatch({ t: 'SET', k: target, v: url });
        setStatus({ msg: 'Logo loaded (external URL)', ok: true });
        setLoading(false);
      };
      imgNoCors.onerror = () => trySource(idx + 1);
      imgNoCors.src = url;
    };
    imgCors.src = url;
  }
  trySource(0);
  return () => { cancelled = true; };
}
