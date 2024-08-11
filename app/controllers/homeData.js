const db = require('../../databases');
const homeData = require("../validations/homeData");

class HomeController {
  static async getHome(req, res) {
    try {
      const totalSiswa = await db('siswa').count('* as total').first();
      const totalKategori = await db('kategori').count('* as total').first();
      const totalMapel = await db('mapel').count('* as total').first();
      const totalMentor = await db('mentor').count('* as total').first();

      const totalBelum = await db('pendaftaran').count('* as total').where('status_bayar', 'belum').first();
      const totalLunas = await db('pendaftaran').count('* as total').where('status_bayar', 'lunas').first();
      const totalPending = await db('pendaftaran').count('* as total').where('status_bayar', 'pending').first();
      const totalTolak = await db('pendaftaran').count('* as total').where('status_bayar', 'ditolak').first();

      const biayaPerBulan = await db('pendaftaran')
        .select(db.raw('MONTH(tanggal_pendaftaran) as bulan, SUM(biaya_pendaftaran) as total_biaya'))
        .where('status_bayar', 'lunas')
        .andWhereRaw('YEAR(tanggal_pendaftaran) = YEAR(CURDATE())')
        .groupByRaw('MONTH(tanggal_pendaftaran)')
        .orderByRaw('MONTH(tanggal_pendaftaran)');

      const bulan = {
        1: 'Januari', 2: 'Februari', 3: 'Maret', 4: 'April', 5: 'Mei', 6: 'Juni',
        7: 'Juli', 8: 'Agustus', 9: 'September', 10: 'Oktober', 11: 'November', 12: 'Desember'
      };
      const biayaBulan = Object.keys(bulan).reduce((acc, key) => {
        acc[key] = 0;
        return acc;
      }, {});

      biayaPerBulan.forEach(data => {
        biayaBulan[data.bulan] = parseFloat(data.total_biaya);
      });

      res.json({
        total_siswa: totalSiswa.total,
        total_kategori: totalKategori.total,
        total_mapel: totalMapel.total,
        total_mentor: totalMentor.total,
        total_belum: totalBelum.total,
        total_lunas: totalLunas.total,
        total_pending: totalPending.total,
        total_tolak: totalTolak.total,
        biaya_per_bulan: biayaBulan
      });
    } catch (error) {
      console.error(error);  // Log the error for debugging
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = HomeController;
